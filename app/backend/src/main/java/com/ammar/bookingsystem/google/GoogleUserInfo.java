package com.ammar.bookingsystem.google;

import com.google.api.client.util.Key;

// Minimal shape for https://www.googleapis.com/oauth2/v2/userinfo — parsed via google-http-client's
// own Gson-based JSON support (already transitively on the classpath), not Jackson, to sidestep
// this stack's Jackson-3 relocation entirely (see CLAUDE.md §B.8).
public class GoogleUserInfo {

    @Key
    public String email;
}
