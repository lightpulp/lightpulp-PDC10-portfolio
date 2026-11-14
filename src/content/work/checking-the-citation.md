---
title: "The citation was formatted perfectly and wrong in three fields"
order: 4
subtitle: "Evaluating factuality when the output looks correct"
summary: "Two paper reviews where the generated APA reference was fluent, plausible, and disagreed with the publisher's own record on author order, year and page range."
finding: "Fluency and correctness are independent. The output that is hardest to evaluate is the output that looks finished."
role: "Solo: review, verification against publisher records"
status: "Submitted"
stack: ["APA 7th", "IEEE Xplore", "Publisher records"]
techniques: ["Source verification", "Factuality checking", "Separating illustration from evidence"]
outcomes: ["clo1", "clo4"]
sources:
  - title: "Paper summary and PHP defensive programming review"
    url: "https://claude.ai/chat/12789afe-c586-48bc-89f4-46f38a11e7b8"
  - title: "Paper summary request — error handling study"
    url: "https://claude.ai/chat/1ff3db40-0e0d-436f-a4a3-40b1f873208f"
---

Two assignments needed a paper review with a correct APA 7th reference. Both references came back looking immaculate. Both were wrong.

## Paper one

The reference was built from the author order printed on the PDF I had. IEEE's own record for the same paper lists the authors in a different order, and the page range was not on my copy at all. The corrected entry:

> Scholte, T., Robertson, W., Balzarotti, D., & Kirda, E. (2012). Preventing input validation vulnerabilities in web applications through automated type analysis. In *2012 IEEE 36th Annual Computer Software and Applications Conference* (pp. 233–243). IEEE.

APA follows the publisher's version, not the typesetting on whatever copy of the PDF happened to reach me. Fixing the reference also meant fixing two in-text citations, because the author order appears in both. A reference list that disagrees with its own in-text citations is worse than one that is simply wrong, since it shows nobody read the whole thing.

## Paper two

Same shape, different field. The draft dated the paper 2016. The published version is 2017, volume 157, issue 6, pages 658–672, and the title ends with a question mark. The 2016 date comes from the online-first release. Both dates are real; only one is correct for the citation.

## What this taught me about evaluating output

Bibliographic metadata is the perfect trap. It is highly structured, so a model produces it in flawless APA shape. It is also arbitrary — there is no way to reason your way to a page range — so the model is doing recall, which is exactly where it is weakest. The result is maximum confidence over minimum grounding, and nothing in the surface of the text signals the difference.

I cannot evaluate that by reading. The only test that works is going to the publisher's record and comparing field by field: authors, order, year, venue, volume, issue, pages, DOI.

The general version, which now applies to everything I do with a model: **check the parts that are arbitrary, not the parts that are reasoned.** An argument I can follow and judge. A page number I cannot. If a claim could not have been derived, it was recalled, and recall needs a source.

## A second failure in the same family

In a separate lab I needed screenshots of terminal output as evidence for a security report. I had styled mock-ups of what the output would look like — accurate in format, consistent with the real UI, and completely synthetic.

They were useful for laying out the report. They were not evidence, and labelling them as such would have been fabrication. The real screenshots came from running the tests on my own machine, and a few of them did not match the mock-ups, which is the entire reason you run the test.

Generated illustration and generated evidence look identical on the page. The difference is only in where it came from, so the provenance has to be tracked by me, not inferred later from the artifact.
