package com.reactnativeskiamodule;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = SkiaModuleModule.NAME)
public class SkiaModuleModule extends ReactContextBaseJavaModule {
    public static final String NAME = "SkiaModule";

    public SkiaModuleModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    static {
        try {
            // Used to load the 'native-lib' library on application startup.
            System.loadLibrary("reactskiamodule");
        } catch (Exception ignored) {
        }
    }

    // Example method
    // See https://reactnative.dev/docs/native-modules-android
    @ReactMethod
    public void multiply(int a, int b, Promise promise) {
        promise.resolve(nativeMultiply(a, b));
    }

    public static native int nativeMultiply(int a, int b);
}
