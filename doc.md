### **Project Brief & Scoping Document: The Elyrion Platform**

**Date:** September 6, 2025

---

#### **1. Project Vision: The Digital Temple & Living Archive**

The vision for Elyrion is to create more than just a streaming platform; it is to build a "digital temple"—a central hub for a learning community. The platform's core metaphor is a physical space where members can access a central archive of knowledge (like a library), specialize in specific fields of study (in different "rooms"), and then contribute their own experiences and learnings back into a "living archive," enriching the collective wisdom for all.

The immediate goal is to establish a reliable, custom-built home for the community's bi-monthly classes, moving away from unreliable third-party applications that have failed them in the past.

---

#### **2. Problem Statement**

The Elyrion community currently relies on a patchwork of tools for its online classes and community management. Previous attempts to use platforms like Circle, Mighty Networks, and Geneva have proven unsustainable, culminating in the latest platform (Geneva) abruptly pivoting to a completely different business model (a dating app), which fractured the user experience and eroded trust.

The core challenge is the lack of a single, stable, and purpose-built environment that can handle:

- Subscription-based access control.
- Reliable live streaming with interactive features.
- Permanent, organized storage of past content.
- Ongoing community engagement around the content.

---

#### **3. Proposed Solution**

We will develop a custom web application that serves as a dedicated space for the Elyrion community. The platform will be built from the ground up to support the entire lifecycle of a class: from scheduling and live delivery to archiving and post-event discussion. This will provide a seamless and branded experience, ensuring long-term stability and control over the community's digital home.

---

#### **4. Core User Flow**

1.  **Onboarding & Subscription:** A new user ("Zac") discovers Elyrion. He signs up and subscribes to a plan to gain access to the "temple." During onboarding, he may be asked to set preferences for topics he's interested in.
2.  **Entering the Hub (The Archive):** Once subscribed, Zac has access to the central hub. Here, he can browse the archive of all past classes, PDFs, and other shared materials.
3.  **Joining a Live Class:** Zac receives a notification for an upcoming live class. He uses a single, simple link to join the session directly within the platform. During the class, he can watch the host (who is screen-sharing), and participate in the real-time chat with other members.
4.  **Post-Class Engagement:** The live class is automatically recorded and added to the archive. Zac can re-watch it at any time and leave comments or questions in a persistent thread below the video, continuing the conversation.
5.  **Specialization & Contribution:** As Zac explores, he can filter content by topic (e.g., "Astronomy"). In the future, after gaining knowledge, he will be able to add his own "perspective and take" on what he's learned, contributing back to the "living archive" for others to see.

---

#### **5. Feature Breakdown (Phased Approach)**

To address the immediate need while building towards the larger vision, we propose a phased development approach.

**Phase 1: The MVP (Minimum Viable Product) - The Core Classroom**
_(Focus: Create a stable replacement for the next class on the 24th)_

- **User Authentication:** Secure sign-up and login for members.
- **Subscription Management:** Integration with a payment provider (e.g., Stripe) to manage monthly subscriptions and control access to the platform.
- **Live Streaming Module:**
  - A secure page for the host ("Teacher" role) to start and manage a live stream.
  - **Essential Feature:** Screen-sharing capability for the host.
  - A viewer page for authenticated subscribers to watch the live event.
- **Real-Time Chat:** A chat window available during the live stream for all viewers to interact. Chat history will be saved and associated with the event.
- **Automatic Archiving & VOD:**
  - The live stream is automatically recorded.
  - Upon completion, the video is processed and made available in the "Archive" section.
  - A simple playback page for users to watch past classes.
- **Persistent Commenting:** A comment section on each archived video page.

**Phase 2: The Living Archive & Community Hub**
_(Focus: Expanding on the core functionality to build the "digital temple")_

- **Advanced Content Organization:**
  - Ability to categorize classes, PDFs, and written content by topic (the "specialty rooms").
  - Filtering and search functionality for the archive.
- **Rich Content Uploads:** Allow hosts to upload supplementary materials like PDFs and articles associated with each class.
- **User Profiles:** Basic profiles showing a user's activity, such as classes they've attended or comments they've made.
- **Dedicated Community Space:** A central forum or discussion area separate from individual class comments, where users can interact on broader topics.

**Phase 3: Future Enhancements**
_(Focus: Realizing the full vision of a user-driven, living system)_

- **User Contribution System:** A feature allowing vetted users to submit their own written perspectives or content to the archive, subject to approval.
- **Advanced User Roles:** A system to elevate experienced members to "Teacher" status, granting them the ability to host their own classes.
- **Personalized Onboarding:** An enhanced sign-up flow that tailors the user's initial experience based on their stated interests.

---

#### **6. Timeline & Next Steps**

The upcoming class on the **24th** serves as an aggressive but important target.

1.  **Immediate Priority:** Confirm the exact scope of the Phase 1 MVP. To meet the deadline, we may need to streamline features (e.g., initially use a simpler VOD interface).
2.  **Contingency Plan:** The client is prepared to use Google Meet one last time if it ensures the custom platform is built correctly and robustly. This is a wise approach.
3.  **Action Plan:**
    - Finalize the MVP feature set this week.
    - Set up the Next.js and Supabase infrastructure.
    - Begin development sprints focusing on Authentication and the Live Streaming/VOD pipeline first.
    - Establish a clear communication channel for progress updates.
