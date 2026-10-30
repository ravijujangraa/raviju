# Portfolio verification

Source: supplied Raviju_Resume.pdf, text and hyperlink annotations, plus visual inspection of the PDF.

- Production: `npm run build` passed.
- Frame integrity: all 864 final WebP images decoded successfully in Pillow (432 per resolution).
- Sequences: run 144, wave 96, transparent rotation 96, original-background rotation 96.
- Automatic run metadata: stand 0, first movement 1, start end / loop start 55, loop length 32, loop entry 31.
- Automatic rotation metadata: front 0, end 95, left 68, right 29.
- Background: #f3f4eb.
- Sampled standing and running alpha bounds: head 47–48, feet 1037; standing height 989–990 source pixels.

Real Chrome browser checks used an iframe with exactly 1440×900 or 390×844 CSS pixels. Body widths were 1430 and 380 respectively (vertical scrollbar excluded); neither overflowed horizontally. The browser reported three canvas elements and zero video elements.

Visually inspected: Hero; About chapters and turn direction; Numbers; marquee; project window and live visuals; skill pit; first and final Journey milestones; credential animation; Contact; mobile navigation. A desktop About phrase initially exceeded its left margin; responsive text fitting corrected it (final heading left 46px; accent width 469px within its available 469px).

Interaction checks: horizontal character following and mirrored leftward running; speech bubbles; project pause/play, visual switching and arrow-key handling; filter state (9 Tools pills highlighted, 22 other pills dimmed), keyboard tossing, mouse dragging, scrolling through the pit and Shake all; mobile menu open/close; reduced-motion mode with paused autoplay, static skills, and all four Journey cards presented as a readable timeline.

Screenshots include exact-size Hero and other section captures. The browser's custom clip capture intermittently timed out for long-page/pinned views; supplemental native captures retain the browser viewport dimensions rather than falsely resizing the scene. Mobile native captures are cropped to the exact 390×844 iframe bounds where applicable. These capture limitations do not alter the tested iframe viewport size.

A constant 60fps was not certified by this cloud browser. The implementation uses GSAP's ticker, bounded frame decoding, responsive image resolution, transforms for moving elements, and off-screen loop suspension. The optional `?qa=1` instrumentation records a short requestAnimationFrame sample in document data attributes when the browser runs long enough without automation suspension.

Content limits: the resume has one marketing project, no GitHub/repository URLs, no programming stack or coding-platform statistics, no CGPA/rank/hackathon achievements, no expected graduation year, and no separate certifications. The Digital Marketing Diploma is clearly labelled Education. The absent character.png is replaced by the supplied footage's standing frame. No personal credentials, projects or results were invented.
