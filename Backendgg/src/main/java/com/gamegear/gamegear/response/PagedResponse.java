package com.gamegear.gamegear.response;

import org.springframework.data.domain.Page;

import java.util.List;

/**
 * Lightweight pagination envelope returned to the client, decoupled from Spring's
 * internal Page serialization. Carries the page content plus the metadata the UI
 * needs to render a paginator.
 */
public record PagedResponse<T>(
        List<T> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean last
) {
    public static <S, T> PagedResponse<T> from(Page<S> page, List<T> content) {
        return new PagedResponse<>(
                content,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }
}
