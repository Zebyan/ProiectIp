plugins {
    alias(libs.plugins.android.application)
}

android {
    namespace = "com.example.aplicatieandroidip"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.example.aplicatieandroidip"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    buildFeatures {
        viewBinding = true
        buildConfig = true
    }

}

dependencies {
    implementation(libs.navigation.ui.ktx)
    val fragment_version = "1.8.7"
    implementation(libs.appcompat)
    implementation(libs.material)
    implementation(libs.activity)
    implementation(libs.constraintlayout)
    implementation(libs.legacy.support.v4)
    implementation(libs.recyclerview)
    testImplementation(libs.junit)
    androidTestImplementation(libs.ext.junit)
    androidTestImplementation(libs.espresso.core)
    implementation("androidx.fragment:fragment:$fragment_version")
    implementation ("com.google.android.material:material:1.12.0")

    val nav_version = "2.9.0"
    implementation (libs.navigation.fragment)
    implementation ("androidx.navigation:navigation-ui:$nav_version")
}