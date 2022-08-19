cmake_minimum_required(VERSION 3.4.1)

set (CMAKE_VERBOSE_MAKEFILE ON)
set (CMAKE_CXX_STANDARD 17)
set (CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -DSK_GL -DSK_BUILD_FOR_ANDROID -DFOLLY_NO_CONFIG=1 -DFOLLY_HAVE_CLOCK_GETTIME=1 -DFOLLY_HAVE_MEMRCHR=1 -DFOLLY_USE_LIBCPP=1 -DFOLLY_MOBILE=1 -DON_ANDROID -DONANDROID")

set (PACKAGE_NAME "reactskiamodule")

#region: react native / JSI / JNI
set(build_DIR ${CMAKE_SOURCE_DIR}/build)
file(GLOB LIBRN_DIR "${PREBUILT_DIR}/${ANDROID_ABI}")
file(GLOB libfbjni_link_DIRS "${build_DIR}/fbjni*.aar/jni/${ANDROID_ABI}")
file(GLOB libfbjni_include_DIRS "${build_DIR}/fbjni-*-headers.jar/")

link_directories(./libs/${ANDROID_ABI}/)

if(${REACT_NATIVE_VERSION} LESS 66)
    file(
            TO_CMAKE_PATH
            "${NODE_MODULES_DIR}/react-native/ReactCommon/jsi/jsi/jsi.cpp"
            INCLUDE_JSI_CPP
    )
endif()
#endregion

add_library(
        ${PACKAGE_NAME}
        SHARED
        ../cpp/react-native-skia-module.cpp
        cpp-adapter.cpp
)

# Specifies a path to native header files.
target_include_directories(
        ${PACKAGE_NAME}
        PRIVATE

        # React native / JSI / JNI
        "${NODE_MODULES_DIR}/react-native/ReactCommon/callinvoker"
        "${NODE_MODULES_DIR}/react-native/ReactCommon/jsi"
        "${NODE_MODULES_DIR}/react-native/ReactCommon"
        "${NODE_MODULES_DIR}/react-native/ReactCommon/react/nativemodule/core"
        "${NODE_MODULES_DIR}/react-native/ReactAndroid/src/main/java/com/facebook/react/turbomodule/core/jni"

        ../cpp
        ../cpp/skia

        # include all rn-skia headers
        "${NODE_MODULES_DIR}/@shopify/react-native-skia/android/cpp/skia/include/config/"
        "${NODE_MODULES_DIR}/@shopify/react-native-skia/android/cpp/skia/include/core/"
        "${NODE_MODULES_DIR}/@shopify/react-native-skia/android/cpp/skia/include/effects/"
        "${NODE_MODULES_DIR}/@shopify/react-native-skia/android/cpp/skia/include/utils/"
        "${NODE_MODULES_DIR}/@shopify/react-native-skia/android/cpp/skia/include/pathops/"
        "${NODE_MODULES_DIR}/@shopify/react-native-skia/android/cpp/skia/modules/"
        "${NODE_MODULES_DIR}/@shopify/react-native-skia/android/cpp/skia/include/"
        "${NODE_MODULES_DIR}/@shopify/react-native-skia/android/cpp/skia/"

        "${NODE_MODULES_DIR}/@shopify/react-native-skia/android/cpp/api/"
        "${NODE_MODULES_DIR}/@shopify/react-native-skia/android/cpp/jsi/"
        "${NODE_MODULES_DIR}/@shopify/react-native-skia/android/cpp/jni/include/"
        "${NODE_MODULES_DIR}/@shopify/react-native-skia/android/cpp/rnskia-android/"
        "${NODE_MODULES_DIR}/@shopify/react-native-skia/android/cpp/rnskia/"
        "${NODE_MODULES_DIR}/@shopify/react-native-skia/android/cpp/rnskia/values/"
        "${NODE_MODULES_DIR}/@shopify/react-native-skia/android/cpp/utils/"

        ${libfbjni_include_DIRS}
)

# Import prebuilt SKIA libraries

#TODO: make this:
#   - [x] relative
#   - [ ] make skia stuff accessible
#   - [ ] tweak gradle to build rnskia first (because otherwise the .so file won't be there)
set (RNSKIA_LIB "rnskia")
add_library(rnskia SHARED IMPORTED)
set_property(TARGET rnskia PROPERTY IMPORTED_LOCATION "${NODE_MODULES_DIR}/@shopify/react-native-skia/android/build/intermediates/merged_native_libs/${BUILD_TYPE}/out/lib/${ANDROID_ABI}/libreactskia.so")

# TODO: can we pull that out from the shared lib?
# prebuild libs from the @shopify/react-native-skia repo
set (SKIA_LIBS_PATH "${NODE_MODULES_DIR}/@shopify/react-native-skia/libs/android/${ANDROID_ABI}")
set (SKIA_MODULE_LIBS_PATH "${CMAKE_CURRENT_SOURCE_DIR}/libs/${ANDROID_ABI}")

set (SKIA_LIB "skia")
set (SKIA_SKSHAPER_LIB "skshaper")
set (SKIA_MODULE_SKSG_LIB "sksg")
set (SKIA_MODULE_SKOTTIE_LIB "skottie")

add_library(skia STATIC IMPORTED)
set_property(TARGET skia PROPERTY IMPORTED_LOCATION "${SKIA_LIBS_PATH}/libskia.a")

add_library(skshaper STATIC IMPORTED)
set_property(TARGET skshaper PROPERTY IMPORTED_LOCATION "${SKIA_MODULE_LIBS_PATH}/libskshaper.a")

add_library(sksg STATIC IMPORTED)
set_property(TARGET sksg PROPERTY IMPORTED_LOCATION "${SKIA_MODULE_LIBS_PATH}/libsksg.a")

add_library(skottie STATIC IMPORTED)
set_property(TARGET skottie PROPERTY IMPORTED_LOCATION "${SKIA_MODULE_LIBS_PATH}/libskottie.a")

find_library(
        LOG_LIB
        log
)

#region react native / JSI
find_library(
        JSI_LIB
        jsi
        PATHS ${LIBRN_DIR}
        NO_CMAKE_FIND_ROOT_PATH
)
if(${REACT_NATIVE_VERSION} LESS 66)
    # JSI lib didn't exist on RN 0.65 and before. Simply omit it.
    set (JSI_LIB "")
else()
    # RN 0.66 distributes libjsi.so, can be used instead of compiling jsi.cpp manually.
    find_library(
            JSI_LIB
            jsi
            PATHS ${LIBRN_DIR}
            NO_CMAKE_FIND_ROOT_PATH
    )
endif()

find_library(
        REACT_LIB
        react_nativemodule_core
        PATHS ${LIBRN_DIR}
        NO_CMAKE_FIND_ROOT_PATH
)

find_library(
        FBJNI_LIBRARY
        fbjni
        PATHS ${libfbjni_link_DIRS}
        NO_CMAKE_FIND_ROOT_PATH
)

find_library(
        TURBOMODULES_LIB
        turbomodulejsijni
        PATHS ${LIBRN_DIR}
        NO_CMAKE_FIND_ROOT_PATH
)
#endregion

# Link
target_link_libraries(
        ${PACKAGE_NAME}
        ${LOG_LIB}
        ${FBJNI_LIBRARY}
        ${REACT_LIB}
        ${JSI_LIB}
        ${TURBOMODULES_LIB}
        ${SKIA_MODULE_SKOTTIE_LIB}
        ${SKIA_SKSHAPER_LIB}
        ${SKIA_MODULE_SKSG_LIB}
        ${SKIA_LIB}
        ${RNSKIA_LIB}
        -ljnigraphics
        -lGLESv2
        -lEGL
        -landroid
)
