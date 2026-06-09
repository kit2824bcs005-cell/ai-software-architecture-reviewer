def detect_architecture(text: str):

    text = text.lower()

    if "microservice" in text or "services" in text:
        return "Microservices"

    elif "monolith" in text or "single application" in text:
        return "Monolith"

    elif "event" in text or "kafka" in text or "queue" in text:
        return "Event Driven"

    else:
        return "Layered Architecture"


def score_architecture(text: str):

    text = text.lower()

    scores = {
        "security": 0,
        "scalability": 0,
        "performance": 0,
        "maintainability": 0,
        "availability": 0
    }

    # SECURITY
    if "auth" in text or "jwt" in text or "oauth" in text:
        scores["security"] += 6
    if "encryption" in text:
        scores["security"] += 4

    # SCALABILITY
    if "microservice" in text:
        scores["scalability"] += 5
    if "load balancer" in text:
        scores["scalability"] += 3
    if "horizontal scaling" in text:
        scores["scalability"] += 2

    # PERFORMANCE
    if "cache" in text or "redis" in text:
        scores["performance"] += 5
    if "optimization" in text:
        scores["performance"] += 3

    # MAINTAINABILITY
    if "modular" in text or "clean architecture" in text:
        scores["maintainability"] += 6
    if "separation of concerns" in text:
        scores["maintainability"] += 4

    # AVAILABILITY
    if "replication" in text:
        scores["availability"] += 5
    if "failover" in text:
        scores["availability"] += 5

    # MAX LIMIT = 10
    for k in scores:
        scores[k] = min(scores[k], 10)

    return scores


def generate_recommendations(text: str):

    text = text.lower()

    recommendations = []

    if "cache" not in text:
        recommendations.append("Add Redis caching layer for better performance")

    if "load balancer" not in text:
        recommendations.append("Add Load Balancer for traffic distribution")

    if "microservice" not in text:
        recommendations.append("Consider migrating to Microservices architecture")

    if "logging" not in text:
        recommendations.append("Add centralized logging (ELK stack)")

    if "monitoring" not in text:
        recommendations.append("Add monitoring tools (Prometheus/Grafana)")

    return recommendations