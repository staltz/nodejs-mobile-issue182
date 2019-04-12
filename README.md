# nodejs-mobile issue 182

> Reproducible case of a leveldown + nodejs-mobile bug

SUMMARY:

- `react-native@0.59.4`
- `nodejs-mobile-react-native@0.4.0`
- `leveldown@4.0.1` in the nodejs-project
- Device: Nexus 5 (`armv7l` Android 6.0.1, other devices seem to have no issues, or different issues)
- Crash: `Error: dlopen failed: cannot locate symbol "__aeabi_memcpy"`

## Two projects

- Project `reactnative055` succeeds ✔️
- Project `reactnative059` fails ❌

## Similarities between projects

- package.json: `"nodejs-mobile-react-native": "0.4.0"`
- nodejs-project requires `leveldown@4.0.1`
- `com.android.tools.build:gradle:3.3.1'`
- `https\://services.gradle.org/distributions/gradle-4.10.2-all.zip`
- `buildToolsVersion "28.0.3"`
- `compileSdkVersion 28`
- `targetSdkVersion 28`
- `minSdkVersion 21`
- `supportLibVersion "27.0.2"`
- `build.gradle` > `ndk` > `abiFilters "armeabi-v7a"`

Both projects have a simple nodejs-project `main.js` that requires leveldown. Take a look at the implementation of `main.js` but this crash should also occur even if the implementation had only `require('leveldown')` and nothing else.

The React Native `App.js` is a simple implementation that just sends messages to the nodejs-project.

## Differences between projects

- Project `reactnative055` ✔️
  - `"react-native": "0.55.4"`
- Project `reactnative059` ❌
  - `"react-native": "0.59.4"`

## Setup on the host machine

- Used NDK r17 (but I remember using r19 and having the same bug)
- `cmake/3.6.4111459`
- Computer is an x86_64 running Ubuntu 18.04.2
- Node.js 10.15.3
- npm 6.4.1

## Steps

1. Attach a **Nexus 5** via USB (or some other **`armv7l` Android 6.0.1** device)
1. `npm i`
1. `react-native run-android`

## Expected

App should not crash upon startup, and pressing the blue button in the app should display an Alert with a counter that increments on every button press.

## Actual

For the project `reactnative059`:

After a few seconds, app crashes (apparently at the time `leveldown` is required), with the following error:

```
Error: dlopen failed: cannot locate symbol "__aeabi_memcpy" referenced by "/data/data/com.reproduction/files/nodejs-project/node_modules/leveldown/build/Release/leveldown.node"...
```

<details>

 <summary>CLICK HERE TO EXPAND</summary>
 <p>

```
04-12 19:40:13.130 23187 23226 I ReactNativeJS: Running application "reproduction" with appParams: {"rootTag":1}. __DEV__ === true, development-level warning are ON, performance optimizations are OFF
04-12 19:40:13.168 23275 23275 W Thread-2579: type=1400 audit(0.0:2304): avc: denied { ioctl } for path="socket:[7694]" dev="sockfs" ino=7694 ioctlcmd=5451 scontext=u:r:untrusted_app:s0:c512,c768 tcontext=u:r:zygote:s0 tclass=unix_dgram_socket permissive=0
04-12 19:40:13.168 23275 23275 W Thread-2579: type=1400 audit(0.0:2305): avc: denied { ioctl } for path="/sys/kernel/debug/tracing/trace_marker" dev="debugfs" ino=3032 ioctlcmd=5451 scontext=u:r:untrusted_app:s0:c512,c768 tcontext=u:object_r:debugfs:s0 tclass=file permissive=0
04-12 19:40:13.168 23275 23275 W Thread-2579: type=1400 audit(0.0:2306): avc: denied { ioctl } for path="socket:[643420]" dev="sockfs" ino=643420 ioctlcmd=5451 scontext=u:r:untrusted_app:s0:c512,c768 tcontext=u:r:system_server:s0 tclass=unix_stream_socket permissive=0
04-12 19:40:13.308 23187 23276 I NODEJS-MOBILE: referenceTable head length=54 1
04-12 19:40:13.309 23187 23276 I NODEJS-MOBILE: referenceTable GDEF length=808 1
04-12 19:40:13.310 23187 23276 I NODEJS-MOBILE: referenceTable GSUB length=11364 1
04-12 19:40:13.310 23187 23276 I NODEJS-MOBILE: referenceTable GPOS length=49206 1
04-12 19:40:13.311 23187 23276 I NODEJS-MOBILE: referenceTable head length=54 1
04-12 19:40:14.735   201   806 D audio_hw_primary: disable_audio_route: reset and update mixer path: low-latency-playback
04-12 19:40:14.735   201   806 D audio_hw_primary: disable_snd_device: snd_device(2: speaker)
04-12 19:40:15.070 23187 23277 E NODEJS-MOBILE: /data/data/com.reproduction/files/nodejs-project/node_modules/bindings/bindings.js:91
04-12 19:40:15.070 23187 23277 E NODEJS-MOBILE:         throw e
04-12 19:40:15.070 23187 23277 E NODEJS-MOBILE:         ^
04-12 19:40:15.070 23187 23277 E NODEJS-MOBILE:
04-12 19:40:15.070 23187 23277 E NODEJS-MOBILE: Error: dlopen failed: cannot locate symbol "__aeabi_memcpy" referenced by "/data/data/com.reproduction/files/nodejs-project/node_modules/leveldown/build/Release/leveldown.node"...
04-12 19:40:15.070 23187 23277 E NODEJS-MOBILE:     at Object.Module._extensions..node (internal/modules/cjs/loader.js:717:18)
04-12 19:40:15.070 23187 23277 E NODEJS-MOBILE:     at Module.load (internal/modules/cjs/loader.js:598:32)
04-12 19:40:15.070 23187 23277 E NODEJS-MOBILE:     at tryModuleLoad (internal/modules/cjs/loader.js:537:12)
04-12 19:40:15.070 23187 23277 E NODEJS-MOBILE:     at Function.Module._load (internal/modules/cjs/loader.js:529:3)
04-12 19:40:15.070 23187 23277 E NODEJS-MOBILE:     at Module.require (internal/modules/cjs/loader.js:636:17)
04-12 19:40:15.070 23187 23277 E NODEJS-MOBILE:     at require (internal/modules/cjs/helpers.js:20:18)
04-12 19:40:15.070 23187 23277 E NODEJS-MOBILE:     at bindings (/data/data/com.reproduction/files/nodejs-project/node_modules/bindings/bindings.js:84:48)
04-12 19:40:15.070 23187 23277 E NODEJS-MOBILE:     at Object.<anonymous> (/data/data/com.reproduction/files/nodejs-project/node_modules/leveldown/leveldown.js:3:36)
04-12 19:40:15.070 23187 23277 E NODEJS-MOBILE:     at Module._compile (internal/modules/cjs/loader.js:688:30)
04-12 19:40:15.070 23187 23277 E NODEJS-MOBILE:     at Object.Module._extensions..js (internal/modules/cjs/
04-12 19:40:15.070 23187 23277 E NODEJS-MOBILE: loader.js:699:10)
```

 </p>
</details>

## Logs

For additional logs, see also these files (in this repo):

- `android_gradle_build.55.json` versus `android_gradle_build.59.json` (HINT: they are identical except for directory paths of the projects)
- `leveldown-compilation.55.log` versus `leveldown-compilation.59.log` (HINT: they are **seem** to be mostly identical)
