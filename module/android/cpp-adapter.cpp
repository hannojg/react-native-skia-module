#include <jni.h>
#include "react-native-skia-module.h"

extern "C" JNIEXPORT jint JNICALL
Java_com_reactnativeskiamodule_SkiaModuleModule_nativeMultiply(JNIEnv *env, jclass type, jint a, jint b)
{
    return example::multiply(a, b);
}
