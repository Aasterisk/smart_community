
const MAXREQCOUNT = 100
const MINREQCOUNT = 10

const MAXREQCOUNT_LIVE = 50

//Decoder request.
const kInitDecoderReq       = 0;
const kUninitDecoderReq     = 1;
const kOpenDecoderReq       = 2;
const kCloseDecoderReq      = 3;
const kFeedDataReq          = 4;
const kStartDecodingReq     = 5;
const kPauseDecodingReq     = 6;
const kSeekDecoderReq       = 7;
const kClearDecoderReq      = 8;

//Decoder response.
const kInitDecoderRsp       = 0;
const kUninitDecoderRsp     = 1;
const kOpenDecoderRsp       = 2;
const kCloseDecoderRsp      = 3;
const kVideoFrame           = 4;
const kAudioFrame           = 5;
const kStartDecodingRsp     = 6;
const kPauseDecodingRsp     = 7;
const kDecodeFinishedEvt    = 8;
const kStartFeedingEvt      = 9;
const kPauseFeedingEvt      = 10;
const kDecodeErrorEvt       = 11;
//import "./libffmpeg.js";

self.Module = {
    onRuntimeInitialized: function () {
        onWasmLoaded();
    }
};


self.importScripts('libffmpeg.js');

function Decoder() {
    //this.logger         = new Logger("Decoder");
    this.coreLogLevel   = 1;
    this.wasmLoaded     = false;
    this.tmpReqQue      = [];
    this.tmpDataQue     = [];
    this.cacheBuffer    = null;
    this.cacheSize      = 0;
    this.decodeTimer    = null;
    this.videoCallback  = null;
    this.audioCallback  = null;
    this.decoderID      = 0;
    this.feedstatus    = 0;
    this._frameDur     = 40;//MS
    this._startDec      = 0;
    this._lastPts       = 0;
    this._totalDur      = 0;
    this._count         = 0;
    this._speed         = 1;
    this._inputCount    = 0;
}

Decoder.prototype.initDecoder = function (chunkSize) {
    var ret = Module._initDecoder(this.coreLogLevel);
    //this.logger.logInfo("initDecoder return " + ret + ".");
    if (0 == ret) {
        chunkSize = chunkSize || 65536;
        this.cacheBuffer = Module._malloc(chunkSize);
        this.cacheSize = chunkSize
    }
    var objData = {
        t: kInitDecoderRsp,
        e: ret
    };
    self.postMessage(objData);
};

Decoder.prototype.uninitDecoder = function () {
    var ret = Module._uninitDecoder();
   // this.logger.logInfo("Uninit ffmpeg decoder return " + ret + ".");
    if (this.cacheBuffer != null) {
        Module._free(this.cacheBuffer);
        this.cacheBuffer = null;
        this.cacheSize = 0;
    }
};

Decoder.prototype.openDecoder = function (cd, islive) {
    var paramCount = 1, paramSize = 4;
    var paramByteBuffer = Module._malloc(paramCount * paramSize);
    var codeId = 3;
    if(cd == 9) {
        codeId = 2;
    } else if(cd == 12) {
        codeId = 3;
    } else if(cd == 7) {
        codeId = 1;
    } else if(cd == 13) {
        codeId = 4;
    }
    console.log('Decoder.openDecoder: code[', cd, '], codeId[', codeId, ']');
    //codeId: 1-h264;  2-mpeg4; 3-h265; 4-svac
    //copydata: 1 拷贝YUV数据 0 不拷贝，仅svac有效
    var ret = Module._openDecoder(paramByteBuffer, codeId, 1, this.videoCallback, this.audioCallback);
    if (ret == 0) {
        var paramIntBuff    = paramByteBuffer >> 2;
        var paramArray      = Module.HEAP32.subarray(paramIntBuff, paramIntBuff + paramCount);
        this.decoderID      = paramArray[0];
        this.islive         = islive;
    } 
    var objData = {
        t: kOpenDecoderRsp,
        e: ret
    };
    self.postMessage(objData);
    Module._free(paramByteBuffer);
};

Decoder.prototype.closeDecoder = function () {
    //this.logger.logInfo("closeDecoder.");

    this.tmpDataQue     = [];

    if (this.decodeTimer) {
        clearInterval(this.decodeTimer);
        this.decodeTimer = null;
       // this.logger.logInfo("Decode timer stopped.");
    }

    var ret = Module._closeDecoder(this.decoderID);
   // this.logger.logInfo("Close ffmpeg decoder return " + ret + ".");
    this.decoderID = 0
    var objData = {
        t: kCloseDecoderRsp,
        e: 0
    };
    self.postMessage(objData);
};





Decoder.prototype.startDecoding = function (speed, bdel) {
    //this.logger.logInfo("Start decoding.");
    if (this.decodeTimer) {
        clearInterval(this.decodeTimer);
    }
    //this._startDec = new Date().getTime();
    if(typeof speed === 'number'){
        this._speed = speed;
    }
    if(bdel === true) { //清空数据
        var dq = this.tmpDataQue; 
        dq.splice(0, dq.length);
    }
    //console.log("Decoder tmpDataQue: ",this.tmpDataQue);
    
    this.decodeTimer = setInterval(this.decode.bind(this), this._frameDur/this._speed);
    
};

Decoder.prototype.pauseDecoding = function () {
    //this.logger.logInfo("Pause decoding.");
    if (this.decodeTimer) {
        clearInterval(this.decodeTimer);
        this.decodeTimer = null;
    }
};


Decoder.prototype.SeekDecoder = function (pts) {
    //this.logger.logInfo("Pause decoding.");
    var dq = this.tmpDataQue;
    var del = 0;
    if(pts == -1) {
        dq.splice(0, dq.length);
        //console.log("delete all :", dq.length);
    } else {
        for(var i = 0, len = dq.length; i < len; i++){
            if(dq[i].k==1) { //I帧 
                if(dq[i].s < pts){ //时间戳小
                    del = i;
                } else if(dq[i].s = pts) { //
                    del = i; 
                    break;
                } else {
                    break;
                }
            } 
        }
        if(del > 0) {
            dq.splice(0, del);
            //console.log("delete [", del,"] :", dq.length);
        }  
    }
   
};

Decoder.prototype.decode = function () {
    if (this.feedstatus == 1 && this.tmpDataQue.length < MINREQCOUNT ) {
        this.feedstatus = 0;
        self.postMessage({
            t: kStartFeedingEvt
        });
        //console.log("startfeeding (", this.tmpDataQue.length,")");
    }
    if(this.tmpDataQue.length > 0) {
        var dataReq = this.tmpDataQue.shift();
        //console.log("decodeFrameData: ", dataReq.s, dataReq.k);
        this.decodeFrameData(dataReq.d, dataReq.s);
    }
    // var now = new Date().getTime();
    // var interval = this._frameDur - 3 - now + this._startDec;
    // this._startDec = now;
    // console.log("decode: ",interval, new Date())
    // this.decodeTimer = setTimeout(this.decode.bind(this), interval > 0 ? interval : 0);

};

Decoder.prototype.decodeFrameData = function (data, pts) {
    var typedArray = data;//new Uint8Array(data);
    if (typedArray.length > this.cacheSize) {
        Module._free(this.cacheBuffer);
        this.cacheSize = typedArray.length + 1000;
        this.cacheBuffer = Module._malloc(this.cacheSize);
    }
    Module.HEAPU8.set(typedArray, this.cacheBuffer);
    //console.log("decoder _decodeOnePacket(",this.decoderID, typedArray.length, pts,")")
    var error = Module._decodeOnePacket(this.decoderID, this.cacheBuffer, typedArray.length, pts, pts);
    this._inputCount += 1;
    if(this._inputCount > 100) {
         self.postMessage({
            t: kDecodeErrorEvt
        });
    }
    // if(error!=0){
    //     //console.log("_decodeOnePacket error");
    // }
};

Decoder.prototype.processReq = function (req) {
    //this.logger.logInfo("processReq " + req.t + ".");
    switch (req.t) {
        case kInitDecoderReq:
            this.initDecoder(req.s, req.c);
            break;
        case kUninitDecoderReq:
            this.uninitDecoder();
            break;
        case kOpenDecoderReq:
            this.openDecoder(req.cd, req.l);
            break;
        case kCloseDecoderReq:
            this.closeDecoder();
            break;
        case kStartDecodingReq:
            this.startDecoding(req.i, req.d);
            break;
        case kPauseDecodingReq:
            this.pauseDecoding();
            break;
        case kSeekDecoderReq:
            this.SeekDecoder(req.s);
            break;
        default:
          //  this.logger.logError("Unsupport messsage " + req.t);
    }
};

Decoder.prototype.cacheAndProReq = function (req) {
    if (req) {
        if (req.t === kFeedDataReq){ //保存数据
            this.tmpDataQue.push(req);
            if(this._count >= 0) {
                var dif = req.s - this._lastPts,
                frame = this._frameDur;
                this._totalDur += (dif <= 0 || dif >= 2000) ? frame : dif;
                if(this._count > 20) {
                    var val = this._totalDur / this._count;
                    if(frame - val > 3){
                        this._frameDur = val;
                        this.startDecoding();
                        this._count = -1;
                        //console.log("adjust display speed")
                    }
                }
            }
            this._lastPts = req.s;
            this._count ++ 
            var dq = this.tmpDataQue;
            if(this.islive){ //丢帧
                if ( req.k == 1 && dq.length > MAXREQCOUNT_LIVE) {
                    dq.splice(0, dq.length -1);
                }
            } else { //暂停流
                if (this.feedstatus == 0 && this.tmpDataQue.length > MAXREQCOUNT) {
                    this.feedstatus = 1;
                    self.postMessage({
                        t: kPauseFeedingEvt
                    });
                    //console.log("pausefeeding (", this.tmpDataQue.length, req.s,")");
                } else if (this.feedstatus == 1 && this.tmpDataQue.length < MINREQCOUNT ) {
                    this.feedstatus = 0;
                    self.postMessage({
                        t: kStartFeedingEvt
                    });
                    //console.log("startfeeding (", this.tmpDataQue.length, req.s,")");
                }
            }
            
        } else { //处理命令
            if(!this.wasmLoaded || this.tmpReqQue.length > 0) { //保存命令
                this.tmpReqQue.push(req);
            } else { //直接处理
                this.processReq(req);
            }
        }
    }

    if (this.wasmLoaded && this.tmpReqQue.length > 0) { //处理命令
        var proReq = this.tmpReqQue.shift();
        this.processReq(proReq);
        if(this.tmpReqQue.length > 0 ) {
            setTimeout(this.cacheAndProReq, 0);
        }
    } 
};

Decoder.prototype.onWasmLoaded = function () {
   // this.logger.logInfo("Wasm loaded.");
   //console.log("Wasm loaded!!!!");
    this.wasmLoaded = true;

    // this.videoCallback = Module.addFunction(function (buff, size, width, height, timestamp) {
    //     var outArray = Module.HEAPU8.subarray(buff, buff + size);
    //     var data = new Uint8Array(outArray);
    //     var objData = {
    //         t: kVideoFrame,
    //         w: width,
    //         h: height,
    //         s: timestamp,
    //         d: data
    //     };
    //     self.postMessage(objData, [objData.d.buffer]);
    // });

    var _this = this;
    this.videoCallback = Module.addFunction(function (y, yline, u, uline, v, vline, width, height, timestamp) {
        //console.log("videoCallback ",width, height, timestamp)
        _this._inputCount = 0;
        var outArray = Module.HEAPU8.subarray(y, y+yline*height);
        var ydata = new Uint8Array(outArray);
        outArray = Module.HEAPU8.subarray(u, u+uline*height/2);
        var udata = new Uint8Array(outArray);
        outArray = Module.HEAPU8.subarray(v, v+vline*height/2);
        var vdata = new Uint8Array(outArray);
        var objData = {
            t: kVideoFrame,
            w: width,
            h: height,
            ly: yline,
            lu: uline,
            lv: vline,
            s: timestamp,
            y: ydata,
            u: udata,
            v: vdata
        };
        self.postMessage(objData, [objData.y.buffer],[objData.u.buffer], [objData.v.buffer]);
    });
    
    this.audioCallback = Module.addFunction(function (buff, size) {
        var outArray = Module.HEAPU8.subarray(buff, buff + size);
        var data = new Uint8Array(outArray);
        var objData = {
            t: kAudioFrame,
            d: data
        };
        self.postMessage(objData, [objData.d.buffer]);
    });

    this.cacheAndProReq();
};

self.decoder = new Decoder;

self.onmessage = function (evt) {
    if (!self.decoder) {
        console.log("[ER] Decoder not initialized!");
        return;
    }

    var req = evt.data;
    self.decoder.cacheAndProReq(req);


};

function onWasmLoaded() {

    //debugger
    if (self.decoder) {
        self.decoder.onWasmLoaded();
    } else {
        console.log("[ER] No decoder!");
    }
}
