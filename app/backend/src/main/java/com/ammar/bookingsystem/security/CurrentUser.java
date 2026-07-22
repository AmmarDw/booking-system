package com.ammar.bookingsystem.security;

import org.springframework.security.core.context.SecurityContextHolder;

/** Small helper to fetch the authenticated {@link UserPrincipal} from controllers/services. */
public final class CurrentUser {

    private CurrentUser() {}

    public static UserPrincipal get() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserPrincipal userPrincipal) {
            return userPrincipal;
        }
        throw new IllegalStateException("No authenticated UserPrincipal in security context");
    }
}
