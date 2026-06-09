from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet


def generate_pdf_report(file_path, question, answer, architecture, scores, recommendations):

    doc = SimpleDocTemplate(file_path)

    styles = getSampleStyleSheet()
    content = []

    content.append(Paragraph("AI Software Architecture Report", styles["Title"]))
    content.append(Spacer(1, 12))

    content.append(Paragraph(f"Question: {question}", styles["Normal"]))
    content.append(Spacer(1, 12))

    content.append(Paragraph(f"Answer: {answer}", styles["Normal"]))
    content.append(Spacer(1, 12))

    content.append(Paragraph(f"Architecture Type: {architecture}", styles["Heading2"]))
    content.append(Spacer(1, 12))

    content.append(Paragraph("Scores:", styles["Heading3"]))

    for k, v in scores.items():
        content.append(Paragraph(f"{k}: {v}/10", styles["Normal"]))

    content.append(Spacer(1, 12))

    content.append(Paragraph("Recommendations:", styles["Heading3"]))

    for rec in recommendations:
        content.append(Paragraph(f"- {rec}", styles["Normal"]))

    doc.build(content)

    return file_path