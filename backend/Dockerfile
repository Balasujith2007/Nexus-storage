FROM rust:1.76 as builder
ARG SERVICE
ARG CACHEBUST=1

WORKDIR /usr/src/app
COPY . .

# Cache bust to force rebuild - Updated: 2026-05-24
RUN echo "Cache bust: ${CACHEBUST}"

# Build only the specified service
RUN cargo build --release --bin ${SERVICE}

FROM debian:bookworm-slim
ARG SERVICE
RUN apt-get update && apt-get install -y \
    libssl-dev \
    ca-certificates \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/local/bin
COPY --from=builder /usr/src/app/target/release/${SERVICE} ./${SERVICE}

# Create a non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /usr/local/bin
USER appuser

EXPOSE 8080

CMD ["./${SERVICE}"]
