package de.hoppfoundation.klassenzimmer;

import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;
import de.hoppfoundation.klassenzimmer.BuildConfig;


import java.io.IOException;

public class UserAgentInterceptor implements Interceptor {

    public UserAgentInterceptor() {}

    @Override
    public Response intercept(Interceptor.Chain chain) throws IOException {
        int versionCode = BuildConfig.VERSION_CODE;
        String versionName = BuildConfig.VERSION_NAME;

        Request originalRequest = chain.request();
        Request requestWithUserAgent = originalRequest.newBuilder()
            .removeHeader("User-Agent")
            .addHeader("User-Agent", "DIGITALES KLASSENZIMMER ANDROID/"+versionName)
            .build();

        return chain.proceed(requestWithUserAgent);
    }

}