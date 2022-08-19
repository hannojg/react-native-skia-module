#include "react-native-skia-module.h"

#include <utility>
#include "JsiSkSkottie.h"

namespace RNSkia {
    using namespace facebook;

    void RNSkModuleManager::installBindings(
            jsi::Runtime *jsRuntime,
            std::shared_ptr<RNSkPlatformContext> platformContext
    ) {
        // Install bindings
        auto createSkottie = JsiSkSkottie::createCtor(std::move(platformContext));
        // TODO: fix me
        jsRuntime->global().setProperty(
                *jsRuntime, "SkiaApi_SkottieCtor",
                jsi::Function::createFromHostFunction(
                        *jsRuntime,
                        jsi::PropNameID::forAscii(*jsRuntime, "SkottieCtor"),
                        1,
                        createSkottie
                )
        );
    }
}