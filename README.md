# Parrot-Gateway
## API
### user-login
#### request
```json
{
    "api" : "user-login",
    "arguments" : {
        "source":"xiaoai"
    },
    "userId" : "darwin_C7J4i4YMagyPEP7wqbMBMg_C__C_"
}
```
#### reply
```json
{
    "status": {
        "code": 200,
        "errorType": "success"
    },
    "result": {
        "uuid"       : `_key of user`,
        "relation"   : `_key of relation`,
        "parrot"     : `_key of parrot`,
        "lastLogin"  : "2018-12-30",
        "onlineDays" : 3
    }
}
```
### adopt-newborn-parrot
#### request
```json
{
    "api" : "adopt-newborn-parrot",
    "arguments" : {
        "uuid":`_key of user`
    },
    "userId" : "darwin_C7J4i4YMagyPEP7wqbMBMg_C__C_"
}
```
#### reply
```json
{
    "status": {
        "code": 200,
        "errorType": "success"
    },
    "result": {
        "relation": "75097984",
        "parrot": "75097980"
    }
}
```
### start-learning
#### request
```json
{
    "api" : "start-learning",
    "arguments" : {
        "user"  : {
            "uuid"       : "xiaoai__darwin_C7J4i4YMagyPEP7wqbMBMg_C__C_",
            "relation"   : "75097984",
            "parrot"     : "75097980"
        }
    },
    "userId" : "darwin_C7J4i4YMagyPEP7wqbMBMg_C__C_"
}
```
#### reply
```json
{
    "status": {
        "code": 200,
        "errorType": "success"
    },
    "result": {
        "learningId": "75106779"
    }
}
```
### end-learning
#### request
```json
{
    "api" : "end-learning",
    "arguments" : {
        "user"  : {
            "uuid"       : "xiaoai__darwin_C7J4i4YMagyPEP7wqbMBMg_C__C_",
            "relation"   : "75097984",
            "parrot"     : "75097980"
        },
        "uuid" : "75106779"
    },
    "userId" : "darwin_C7J4i4YMagyPEP7wqbMBMg_C__C_"
}
```
#### reply
```json
{
    "status": {
        "code": 200,
        "errorType": "success"
    },
    "result": true
}
```
### add-sentence
#### request
```json
{
    "api" : "add-sentence",
    "arguments" : {
        "user"  : {
            "uuid"       : "xiaoai__darwin_C7J4i4YMagyPEP7wqbMBMg_C__C_",
            "relation"   : "75097984",
            "parrot"     : "75097980"
        },
        "learningId" : "75106779",
        "userSay"    : "乌鸦是黑色的",
        "userMedia"  : "57b222dacc00400fccd3828d",
        "parrotUrl"  : "https://www.xiaodamp.cn/resource/audio/parrot/parrot-default.mp3"
    },
    "userId" : "darwin_C7J4i4YMagyPEP7wqbMBMg_C__C_"
}
```
#### reply
```json
{
    "status": {
        "code": 200,
        "errorType": "success"
    },
    "result": true
}
```
### query-sentences
#### request
```json
{
    "api" : "query-sentences"
    "arguments" : { 
        "relation" : "74284986",
        "day":"2018-12-25"
    }
}
```
#### reply
```json
{
    "status": {
        "code": 200,
        "errorType": "success"
    },
    "result": [
        {
            "userSay": "乌鸦是黑色的",
            "userMedia": "57b222dacc00400fccd3828d",
            "parrotUrl": "https://www.xiaodamp.cn/resource/audio/parrot/parrot-default.mp3"
        },
        {
            "userSay": "黑色的",
            "userMedia": "57b22282dc00400f21e05b8c",
            "parrotUrl": "https://42.159.11.174/api/gateway/tts/v1/25408ce0-083f-11e9-a96c-079cb8098250.mp3"
        },
        {
            "userSay": "鹦鹉是彩色的",
            "userMedia": "57b222306c00400f0772f719",
            "parrotUrl": "https://42.159.11.174/api/gateway/tts/v1/224f6060-083f-11e9-a96c-079cb8098250.mp3"
        },
        {
            "userSay": "这是一只红色的你啊",
            "userMedia": "57b221b6a800400f81853134",
            "parrotUrl": "https://42.159.11.174/api/gateway/tts/v1/1da78330-083f-11e9-a96c-079cb8098250.mp3"
        }
    ]
}
```
