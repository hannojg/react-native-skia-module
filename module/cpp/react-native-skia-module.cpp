#include "react-native-skia-module.h"
#include <SkPaint.h>

namespace example {
	int multiply(float a, float b) {
		auto paint = SkPaint();
		return a * b;
	}
}
