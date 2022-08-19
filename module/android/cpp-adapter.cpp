#include <jni.h>
#include "react-native-skia-module.h"

#include <JniPlatformContext.h>


extern "C"
JNIEXPORT void JNICALL
Java_com_reactnativeskiamodule_SkiaModuleModule_initialize(JNIEnv *env,
                                                           jclass clazz,
                                                           jlong jsi_ptr,
                                                           jobject context) {
    RNSkia::RNSkModuleManager::installBindings(
            reinterpret_cast<facebook::jsi::Runtime *>(jsi_ptr),
            nullptr);
}