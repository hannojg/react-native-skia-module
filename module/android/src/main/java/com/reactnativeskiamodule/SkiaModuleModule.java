package com.reactnativeskiamodule;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
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

    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean install() {
        try {
            System.loadLibrary("reactskiamodule");
            ReactApplicationContext context = getReactApplicationContext();

            initialize(
                    context.getJavaScriptContextHolder().get(),
                    // TODO: yeah, here we'd need to map to PlatformContext, which only exists in RNSkia java code
                    context
            );

            return true;
        } catch (Exception exception) {
            Log.e(NAME, "Failed to initialize Skia Manager!", exception);
            return false;
        }
    }

    public static native void initialize(long jsiPtr, ReactContext context);
}
