# Cheesy Birthday Surprise Website

## Experience
- Start with a four-digit lock screen. Only `1894` unlocks the surprise, and the unlocked state remains during navigation and refreshes.
- Build a playful branching sequence: invitation with a lily-holding puppy → “No” annoyed-puppy detour → “Go back” → “Yes” happy heart-holding puppy → “GOOD GIRL ELLSAMME!” reveal.
- Animate a cute camera into view with “Happy Birthday” lettering and place the uploaded childhood photo inside its frame.
- From the camera scene, present three tactile choices: camera, letter, and cassette.

## Three Keepsakes
- **Camera:** A playful Google-inspired “Memories” screen with “Us, in Every Little Moment,” twelve clearly marked photo spaces, and a back control.
- **Letter:** A childlike handwritten page with stars, stickers, lilies, and a generous placeholder for the message to be supplied later.
- **Cassette:** A retro cassette-themed page with the provided YouTube video, “ALLIYAMBAL KADAVIL ❤️,” and a back control.

## Visual Direction
- Use burgundy, blush pink, paper white, and small sunny accents with a deliberately cheesy handmade scrapbook look.
- Mix striped paper, torn-paper edges, sticker stars, mini hearts, doodles, lilies, chunky rounded lettering, and restrained bounce/pop animations.
- Create original cohesive puppy illustrations for the invitation, annoyed response, and happy response rather than embedding the social-media screenshots.
- Use the uploaded childhood portrait only in the camera reveal; the other uploads serve as visual references.
- Make every scene work comfortably on phones and larger screens, with reduced-motion support.

## Technical Details
- Keep the passcode server-only and store the unlocked state in an encrypted cookie rather than exposing `1894` in the page code.
- Keep the protected birthday content behind the same server check.
- Build the experience as one focused interactive page with accessible labels, keyboard-friendly controls, and route metadata.
- Verify the full lock → no/back → yes → camera → memories/letter/cassette flow at desktop and mobile sizes.
