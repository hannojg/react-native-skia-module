#include "react-native-skia-module.h"
#include <JsiSkColor.h>
#include <RNSkLog.h>

namespace example {
	int multiply(float a, float b) {
        auto color = new RNSkia::JsiSkColor();
        RNSkia::RNSkLogger::logToConsole("Color: %p", color);

		return a * b;
	}
}
