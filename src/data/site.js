// Single source of truth for every page. Copy is taken from aurum.fit (Sept 2026),
// lightly cleaned of typos and keyword repetition. Numbers are the brand's own.

export const brand = {
  name: 'Aurum Fitness',
  domain: 'https://aurum.fit',
  instagram: 'https://www.instagram.com/aurum.community/',
  instagramHandle: '@aurum.community',
  hours: [
    { days: 'Monday to Saturday', time: '5:30 AM to 11:00 PM' },
    { days: 'Sunday', time: '7:00 AM to 9:00 PM' },
  ],
  whatsappText: "Hi, I'm interested in joining Aurum Fitness. Please share the details.",
};

export const stats = [
  { value: 1000, suffix: '+', label: 'Gym members' },
  { value: 5, suffix: '', label: 'Clubs in Bangalore' },
  { value: 483, suffix: '+', label: 'Transformations' },
];

export const pillars = [
  {
    title: 'Ambience & Space',
    body: 'A vibrant, spacious environment with energising music and a vibe that pushes you to give your best every day.',
    img: 'pillar-ambience',
  },
  {
    title: 'Top Notch Equipment',
    body: 'No more waiting for machines. We keep 6-8 machines for every muscle group, so your workout never stalls.',
    img: 'pillar-equipment',
  },
  {
    title: 'Personal Training',
    body: 'Expert trainers give you personal attention to reach your fitness goals faster and more effectively.',
    img: 'pillar-training',
  },
  {
    title: 'Recovery Facilities',
    body: 'A complete recovery suite, including spa, infrared therapy, steam and ice baths, to rejuvenate after every session.',
    img: 'pillar-recovery',
  },
  {
    title: 'All-in-One Nutrition',
    body: 'Comprehensive nutritional guidance and supplements, so everything your fitness journey needs is under one roof.',
    img: 'pillar-nutrition',
  },
  {
    title: 'Prime Locations',
    body: 'Clubs in Indiranagar, Koramangala and Brigade Road, easy to reach so you can stick to your routine.',
    img: 'pillar-locations',
  },
];

export const disciplines = [
  'Strength Training', 'Functional Fitness', 'Personal Training', 'Pilates', 'Group Classes',
  'Performance Coaching', 'Mobility Training', 'Beginner Programmes', 'Nutrition Guidance',
];

// clubs: which locations list the therapy on their own page
export const therapies = [
  { name: 'Cryotherapy', icon: 'snowflake', body: 'Rapid cold exposure to reduce inflammation and accelerate muscle recovery.', clubs: ['ultra'] },
  { name: 'Ice Plunge', icon: 'drop', body: 'Cold immersion to sharpen circulation, resilience and post-training recovery.', clubs: ['ultra', 'lcc'] },
  { name: 'Red Light Therapy', icon: 'sun', body: 'Targeted light therapy supporting cellular repair, skin health and faster healing.', clubs: ['ultra', 'lcc'] },
  { name: 'Infrared Sauna', icon: 'thermometer-hot', body: 'Deep heat that penetrates muscles, relieves tension and supports circulation.', clubs: ['ultra', 'lcc'] },
  { name: 'Steam Room', icon: 'wind', body: 'Moist heat to relax muscles, open airways and clear the mind.', clubs: ['ultra', 'lcc'] },
  { name: 'Spa Therapies', icon: 'flower-lotus', body: 'Restorative treatments for body and mind, designed around recovery.', clubs: ['ultra', 'lcc'] },
  { name: 'IV Therapy', icon: 'syringe', body: 'Personalised IV treatments that hydrate and replenish nutrients.', clubs: ['lcc'] },
  { name: 'Oxygen Therapy', icon: 'heartbeat', body: 'Enriched oxygen sessions to boost energy, focus and recovery capacity.', clubs: ['ultra'] },
  { name: 'Hydrotherapy', icon: 'waves', body: 'Water-based therapy to ease joints, aid mobility and calm the body.', clubs: ['ultra'] },
  { name: 'Vichy Shower', icon: 'shower', body: 'A signature cascading water therapy for full-body renewal.', clubs: ['ultra'] },
];

export const memberships = [
  {
    id: 'day-pass', span: '1', unit: 'Day', name: 'One Day Pass', tagline: 'Your passport to luxury fitness',
    body: 'A single day of access to our world-class facilities and amenities. Perfect for travellers, visitors, or anyone curious about what sets Aurum apart.',
  },
  {
    id: '1-month', span: '1', unit: 'Month', name: '1 Month Membership', tagline: 'Explore your fitness potential',
    body: 'A month of unlimited access. Discover your ideal workout routine, explore our classes and connect with a vibrant community.',
  },
  {
    id: '3-month', span: '3', unit: 'Months', name: '3 Month Membership', tagline: 'Commit to a healthier you',
    body: 'A focused journey with a structured plan and real support. Three months is the ideal window to build habits and see visible change.',
  },
  {
    id: '6-month', span: '6', unit: 'Months', name: '6 Month Membership', tagline: 'Invest in your long-term well-being',
    body: 'Six months of commitment to a healthier lifestyle. Immerse yourself in the Aurum community with personalised support.',
  },
  {
    id: '12-month', span: '12', unit: 'Months', name: '12 Month Membership', tagline: 'Elevate your lifestyle', featured: true,
    body: 'Become part of the Aurum family. Unlimited access to premium amenities, expert guidance and special events designed around your well-being.',
  },
];

export const ptLevels = [
  {
    level: 1, name: 'Elite Performance Architects',
    summary: 'The pinnacle of fitness mastery. A concierge, white-glove approach from our most sought-after coaches.',
    expertise: 'Our most sought-after trainers, with a minimum of 10 years of experience and multiple certifications, and a proven record of transforming bodies and lives at the highest levels of competition and performance.',
    approach: 'A concierge approach to fitness with deep understanding of physiology, nutrition and mental well-being. Bespoke plans that optimise performance and accelerate results around your goals, lifestyle and needs.',
    idealFor: 'High-performing individuals, professional athletes, executives and anyone seeking the absolute best in personalised fitness. An investment in your peak performance.',
  },
  {
    level: 2, name: 'Transformation Specialists',
    summary: 'Highly experienced trainers with a record of dramatic, lasting body transformations.',
    expertise: 'Highly experienced trainers with a proven track record of sculpting bodies and achieving dramatic transformations. Expertise in weight management, injury rehabilitation and advanced training techniques.',
    approach: 'Comprehensive programmes that blend cutting-edge science with personalised attention, with unwavering support and motivation to keep you on track to lasting, life-changing results.',
    idealFor: 'Anyone seeking a significant body transformation, breaking through plateaus, or needing specialised training for specific needs.',
  },
  {
    level: 3, name: 'Lifestyle Integrators',
    summary: 'Functional fitness and sustainable habits that fit a busy life.',
    expertise: 'Knowledgeable trainers with a passion for functional fitness, movement and sustainable lifestyle change, who build adaptable programmes that fit your schedule and goals.',
    approach: 'Integrating fitness seamlessly into your lifestyle, building habits that stick and a balanced approach to health, with versatile training styles that evolve with you.',
    idealFor: 'Busy professionals, people new to fitness, or anyone seeking a balanced approach to health and well-being.',
  },
  {
    level: 4, name: 'Performance Accelerators',
    summary: 'Sport-specific strength and conditioning built on measurable progress.',
    expertise: 'Specialised knowledge in sports-specific training, strength and conditioning and performance enhancement, with a deep understanding of exercise physiology and biomechanics.',
    approach: 'Progressive training methods that push your limits and optimise athletic performance, focused on measurable progress and specific goals.',
    idealFor: 'Athletes, fitness enthusiasts chasing better performance, and anyone with specific fitness goals.',
  },
  {
    level: 5, name: 'Fitness Fundamentals Guides',
    summary: 'A strong, confident foundation in form, technique and healthy habits.',
    expertise: 'Enthusiastic, knowledgeable trainers who teach proper form, technique and exercise principles so you progress safely and effectively.',
    approach: 'A supportive, encouraging environment to learn the basics, build confidence and develop habits that last. A stepping stone to advanced training as you grow.',
    idealFor: 'Beginners, people returning to fitness after a break, or anyone who wants a supportive start.',
  },
];

export const transformations = [
  {
    id: 'abhishek', name: 'Abhishek', role: 'CFO, multinational', img: 'story-abhishek',
    from: 130, to: 82, unit: 'kg', coach: 'Yashwanth',
    title: 'From 130 kg to 82 kg',
    story: 'A stressful, sedentary lifestyle had taken its toll. Being vegetarian made muscle-building tougher, but with Yashwanth and the Aurum team he redefined his limits through personalised training and structured nutrition.',
    quote: 'Protein intake was key to my weight loss and muscle gain. As a vegetarian it was tough, but the right guidance made all the difference.',
  },
  {
    id: 'santhanu', name: 'Santhanu', role: 'IT professional', img: 'story-santhanu', coach: 'Ibrahim', club: 'Aurum Health Club',
    title: 'From IT desk to peak strength',
    story: 'Long hours at a desk took a toll on his health. At Aurum Health Club, with expert guidance from trainer Ibrahim, he found his powerhouse within.',
    quote: 'Aurum changed the way I look at fitness. With the right training and support, I transformed my strength, stamina and overall well-being.',
  },
];

export const reels = [
  { id: 'members', src: 'reel-members', poster: 'poster-members', title: 'Hear it straight from our members', caption: 'Aurum Ultra Luxury, Indiranagar' },
  { id: 'all-ages', src: 'reel-all-ages', poster: 'poster-all-ages', title: 'Fitness for all ages', caption: 'Strength has no age limit' },
  { id: 'one-word', src: 'reel-one-word', poster: 'poster-one-word', title: 'One question. One word.', caption: 'We asked for one word. We got the whole vibe.' },
];

// lat/lng are approximate and only drive the stylised 3D map. Directions use the address.
export const locations = [
  {
    key: 'ultra', slug: 'luxury-gym-in-bangalore-indiranagar', name: 'Aurum Ultra Luxury', area: 'Indiranagar', tier: 'Ultra Luxury',
    address: '4th, 5th & 6th Floor, 35, 80 Feet Road, HAL 3rd Stage, Indiranagar, Bangalore 560075',
    phoneLabel: 'Ultra Luxury', phone: '09916285341', whatsapp: '919916285341',
    lat: 12.9731, lng: 77.6527,
    // The club page has no photography of its own; its Instagram reels carry the visuals.
    images: ['ultra-1'],
    showReels: true,
    seoTitle: 'Luxury Gym in Bangalore - Indiranagar | Aurum Ultra Luxury',
    seoDescription: "Aurum Ultra Luxury, Indiranagar: Asia's first all-inclusive fitness sanctuary with Italian Panatta equipment, personalised coaching and a full recovery ecosystem.",
    headline: "Asia's first all-inclusive fitness sanctuary",
    intro: 'Fitness, recovery, performance and wellness under one roof. Inspired by Roman architecture and equipped with world-renowned Panatta equipment, Aurum is designed for people who believe their health deserves the very best.',
    about: [
      'More than a gym. A lifestyle built around wellness. At Aurum Ultra Luxury, personalised coaching, advanced recovery and luxury wellness work together, so every member gets the attention, guidance and facilities to train with confidence and recover effectively.',
      'Aurum welcomes professionals, entrepreneurs, athletes and wellness enthusiasts looking for a fitness destination that goes beyond conventional gyms.',
    ],
    reasons: [
      { title: 'Exclusive Panatta experience', body: 'Train on Italian-engineered Panatta equipment, trusted worldwide for biomechanics, performance and precision.' },
      { title: 'Advanced recovery', body: 'From cryotherapy and oxygen therapy to steam rooms, spa experiences and recovery lounges.' },
      { title: 'Personalised coaching', body: 'Every programme is tailored to your body, goals and lifestyle, with measurable progress and expert support.' },
      { title: 'Limited membership', body: 'Aurum intentionally keeps memberships limited, creating a more private and personal environment.' },
    ],
    facilities: ['Panatta Strength Equipment', 'Functional Training Zone', 'Cardio Studio', 'Free Weight Area', 'Pilates Studio', 'Group Training Studio', 'Recovery Lounge', 'Premium Changing Rooms', 'Smart Lockers', 'Wellness Spaces'],
    audience: [
      { title: 'Entrepreneurs & business owners', body: 'Time-efficient, high-return training' },
      { title: 'Corporate leaders', body: 'Performance, focus and recovery' },
      { title: 'Athletes', body: 'Panatta precision and coaching' },
      { title: 'Working professionals', body: 'Flexible, personalised programmes' },
      { title: 'Wellness enthusiasts', body: 'Full recovery and spa ecosystem' },
      { title: 'Those who appreciate premium', body: 'Limited membership, private setting' },
    ],
    nearby: ['Domlur', 'HAL', 'MG Road', 'Kodihalli', 'Ulsoor', 'CV Raman Nagar', 'Old Airport Road', 'Jeevan Bima Nagar'],
    faq: [
      { q: 'What makes Aurum one of the best luxury gyms in Bangalore?', a: 'Aurum combines premium facilities, Italian Panatta equipment, personalised coaching, advanced recovery therapies and a limited membership model for a truly exclusive fitness experience.' },
      { q: 'Can I visit Aurum before becoming a member?', a: 'Yes. We recommend booking a private club tour to explore the facilities, meet our team and understand the membership experience.' },
      { q: 'Do you offer personal training?', a: 'Yes. Every personal training programme is customised to your goals, fitness level and lifestyle.' },
      { q: 'Is Aurum suitable for beginners?', a: 'Absolutely. Whether you are new to fitness or an experienced athlete, our coaches build structured programmes around your journey.' },
      { q: 'What wellness facilities are included?', a: 'Members can access recovery therapies, premium changing rooms, steam, spa services, oxygen therapy, cryotherapy and more, depending on the selected membership.' },
    ],
    cta: 'Book a private club tour',
  },
  {
    key: 'lcc', slug: 'aurum-fitness-lcc', name: 'Aurum Luxury Fitness Club', area: 'Indiranagar', tier: 'Luxury Club',
    address: '368, 4th Floor, HAL 2nd Stage, 100 Feet Road, Indiranagar, Bangalore 560008',
    phoneLabel: 'Luxury Club Indiranagar', phone: '08147475647', whatsapp: '918147475647',
    lat: 12.9699, lng: 77.6412,
    images: ['lcc-hero', 'lcc-1', 'lcc-2', 'lcc-3', 'lcc-4', 'lcc-5', 'lcc-6', 'lcc-7', 'lcc-8'],
    seoTitle: 'Aurum Luxury Fitness Club, Indiranagar | Aurum',
    seoDescription: 'A luxury fitness destination on 100 Feet Road, Indiranagar with state-of-the-art equipment, expert coaching and an exclusive recovery centre.',
    headline: 'Train hard. Recover in luxury.',
    intro: 'A luxury fitness destination in Indiranagar, designed for those who seek an elevated, seamless workout experience.',
    about: [
      'State-of-the-art equipment and expert coaching help you achieve your fitness goals in a supportive, motivating environment.',
      "The club's plush interiors combine modern design with comfort. After a challenging workout, indulge in the spa, where soothing treatments for body and mind await.",
    ],
    recoveryNote: 'At Aurum, we believe in recovery as much as training. Our exclusive recovery centre offers:',
    therapies: ['Spa Therapies', 'Ice Plunge', 'Red Light Therapy', 'Infrared Sauna', 'Steam Room', 'IV Therapy'],
    closing: 'Relax, rejuvenate and recover. Your journey to wellness is just beginning.',
    cta: 'Enroll today',
  },
  {
    key: 'health', slug: 'aurum-fitness-community', name: 'Aurum Health Club', area: 'Indiranagar', tier: 'Health Club',
    address: '764, 3rd Floor, 100 Feet Road, Indiranagar, Bangalore 560038',
    phoneLabel: 'Elite Club Indiranagar', phone: '7899513757', whatsapp: '917899513757',
    lat: 12.9786, lng: 77.6404,
    images: ['health-1', 'health-2', 'health-3', 'health-4', 'health-5', 'health-6', 'health-7', 'health-8', 'health-9', 'health-10', 'health-11', 'health-12'],
    seoTitle: 'Gyms in Indiranagar Bangalore - Aurum Health Club',
    seoDescription: 'Aurum Health Club on 100 Feet Road, Indiranagar: affordable premium fitness with expert coaching, a wide range of equipment and a driven community.',
    headline: 'Affordable fitness. Premium experience.',
    intro: 'Where convenience, expert coaching and community spirit come together. Designed for busy professionals, fitness enthusiasts and beginners alike.',
    about: [
      'Quality fitness should be accessible to everyone. Unlike standard gyms, Aurum Health Club offers a refined atmosphere and a driven community, so you enjoy premium fitness without breaking the bank.',
    ],
    reasons: [
      { title: 'Prime location', body: 'Centrally located on 100 Feet Road, easy to reach before work, during a break or after a long day.' },
      { title: 'Expert coaching & personal training', body: 'Certified trainers design programmes around your goals, from weight loss to strength to overall fitness.' },
      { title: 'Lifestyle-friendly workouts', body: 'Flexible timings and efficient workouts for students, entrepreneurs and IT professionals.' },
      { title: 'Community & motivation', body: 'A fitness family of like-minded people who keep you motivated and make training fun.' },
      { title: 'World-class facilities', body: 'Premium equipment, functional training spaces and recovery zones for a complete workout.' },
    ],
    upgrades: [
      { title: 'Wide range of equipment', body: 'Strength, cardio and functional training machines to meet every goal.' },
      { title: 'Motivating environment', body: 'Clean, well-designed interiors that energise every workout.' },
      { title: 'Flexible options', body: 'Pocket-friendly memberships and personal training based on your needs.' },
    ],
    cta: 'Enroll today',
  },
  {
    key: 'kora', slug: 'aurum-fitness-elite', name: 'Aurum Fitness Koramangala', area: 'Koramangala', tier: 'Elite',
    address: '13, 80 Feet Road, above Kotak Mahindra Bank, S.T. Bed, 4th Block, Koramangala, Bangalore',
    phoneLabel: 'Fitness Club Koramangala', phone: '08147475647', whatsapp: '918147475647',
    lat: 12.9343, lng: 77.6286,
    images: ['kora-1', 'kora-2', 'kora-3', 'kora-4', 'kora-5', 'kora-6'],
    seoTitle: 'Best Gym in Bangalore - Koramangala | Aurum Fitness',
    seoDescription: 'Aurum Fitness Koramangala on 80 Feet Road: expert coaching, world-class equipment and flexible timings in the heart of Koramangala.',
    headline: 'Where convenience meets excellence',
    intro: 'A fitness destination in the heart of Koramangala that combines convenience, expert coaching and a premium environment.',
    about: [
      'From beginners to advanced athletes, our programmes are designed to elevate your performance and fit seamlessly into your daily routine.',
    ],
    reasons: [
      { title: 'Prime location in Koramangala', body: 'Right in the heart of Koramangala, with no long commute, for IT professionals, entrepreneurs and residents.' },
      { title: 'Personalised coaching', body: 'Certified trainers build programmes for strength, fat loss or overall wellness.' },
      { title: 'Flexible for busy lifestyles', body: 'Flexible timings and quick, effective workouts for remote workers and Sarjapur Road commuters.' },
      { title: 'World-class equipment', body: 'Every machine and training zone is selected for performance and safety.' },
      { title: 'Community & motivation', body: 'Members motivate each other, celebrate milestones and grow stronger together.' },
    ],
    cta: 'Enroll today',
  },
  {
    key: 'brigade', slug: 'aurum-elite-central', name: 'Aurum Fitness Brigade Road', area: 'Brigade Road', tier: 'Elite Central',
    address: '118, Ashok Nagar, Sholay Circle, Brigade Road, Bangalore',
    phoneLabel: 'Fitness Club Brigade Road', phone: '6366743301', whatsapp: '916366743301',
    lat: 12.9663, lng: 77.6074,
    images: ['brigade-1', 'brigade-2', 'brigade-3', 'brigade-4'],
    seoTitle: 'Personal Training Gym on Brigade Road - Aurum Fitness Central',
    seoDescription: 'Aurum Fitness, Brigade Road: results-driven personal training in central Bangalore for Richmond Town, Convent Road and city professionals.',
    headline: 'Personal training in the centre of the city',
    intro: 'The destination for personal training on Brigade Road, perfectly placed for Richmond Town, Convent Road and everyone working or shopping in the city centre.',
    about: [
      'Choosing Aurum Elite Central means results-driven personal training that adapts to your lifestyle. From early mornings to post-work evenings, we make it easier than ever to prioritise your health.',
    ],
    reasons: [
      { title: 'Prime location & accessibility', body: 'Stop by before work, during lunch, or after meetings and shopping in the city.' },
      { title: 'Expert personal trainers', body: 'Certified coaches design tailored programmes for strength, endurance or specific goals.' },
      { title: 'Customised workouts for busy lifestyles', body: 'Quick, effective sessions that maximise results without wasting a minute.' },
      { title: 'State-of-the-art equipment', body: 'Modern strength and cardio equipment for complete, efficient training.' },
      { title: 'Motivation & accountability', body: 'A coach who keeps you consistent, even on your busiest days.' },
    ],
    cta: 'Enroll today',
  },
];

export const faqs = [
  { q: 'What types of memberships are offered?', a: 'We offer day passes and monthly, quarterly, half-yearly and annual memberships, along with special rates for students and seniors.' },
  { q: "What are the gym's hours?", a: 'We open early and close late to fit your busy lifestyle: Monday to Saturday, 5:30 AM to 11:00 PM, and Sunday, 7:00 AM to 9:00 PM.' },
  { q: 'Is a fitness assessment required?', a: 'No, but we recommend a free assessment for new members so we can tailor your workout plan.' },
  { q: 'What safety protocols are in place?', a: 'We ensure rigorous cleaning and provide hand sanitiser throughout every club.' },
  { q: 'How can I book personal training?', a: 'Personal training can be booked at the front desk, by phone, or online through the form below.' },
];

export const blog = [
  { slug: 'what-facilities-should-you-expect-at-a-luxury-gym-in-bangalore', img: 'blog-luxury-facilities', title: 'What Facilities Should You Expect at a Luxury Gym in Bangalore?', excerpt: 'Premium fitness clubs take a more complete approach than basic gyms. Here is what that should include.' },
  { slug: 'what-makes-a-luxury-gym-in-bangalore-different-from-a-standard-fitness-ce', img: 'blog-luxury-different', title: 'What Makes a Luxury Gym in Bangalore Different From a Standard Fitness Centre', excerpt: 'Choosing a gym today is about more than treadmills, weights and changing rooms.' },
  { slug: 'how-often-should-you-work-with-a-personal-trainer-to-see-progress', img: 'blog-pt-frequency', title: 'How Often Should You Work With a Personal Trainer to See Progress?', excerpt: 'Every day, once a week, or a mix with independent workouts? How to find your rhythm.' },
  { slug: 'can-personal-training-help-with-weight-loss-and-strength-at-the-same-time', img: 'blog-pt-weight-strength', title: 'Can Personal Training Help With Weight Loss and Strength at the Same Time?', excerpt: 'Reducing body fat while getting stronger is possible. Here is how coaching makes it work.' },
  { slug: 'what-makes-a-gym-comfortable-and-welcoming-for-women', img: 'blog-women', title: 'What Makes a Gym Comfortable and Welcoming for Women?', excerpt: 'Atmosphere, trainer support, cleanliness and privacy matter as much as equipment.' },
  { slug: 'what-are-the-best-workout-times-to-avoid-crowded-gyms-in-indiranagar', img: 'blog-crowd-times', title: 'What Are the Best Workout Times to Avoid Crowded Gyms in Indiranagar?', excerpt: 'Plan around peak hours so your equipment is free when you arrive.' },
  { slug: 'what-should-you-ask-a-personal-trainer-before-starting-your-sessions', img: 'blog-pt-questions', title: 'What Should You Ask a Personal Trainer Before Starting Your Sessions?', excerpt: 'Not every trainer follows the same approach. Ask these questions before you commit.' },
  { slug: 'how-to-know-if-a-personal-trainer-is-right-for-your-fitness-goals', img: 'blog-pt-right', title: 'How to Know If a Personal Trainer Is Right for Your Fitness Goals', excerpt: 'Starting is easy. Knowing whether you are training the right way is harder.' },
  { slug: 'does-gym-crowding-affect-your-workout-and-progress', img: 'blog-crowding', title: 'Does Gym Crowding Affect Your Workout and Progress?', excerpt: 'Crowding seems minor, but it can quietly change the quality of every session.' },
  { slug: 'how-important-is-equipment-quality-when-choosing-a-gym-in-bangalore', img: 'blog-equipment', title: 'How Important Is Equipment Quality When Choosing a Gym in Bangalore?', excerpt: 'Price and location come first for most people. Equipment should not come last.' },
  { slug: 'what-should-you-expect-from-a-luxury-fitness-club-in-indiranagar', img: 'blog-luxury-indiranagar', title: 'What Should You Expect From a Luxury Fitness Club in Indiranagar?', excerpt: 'Luxury is about the experience inside the gym, not just expensive equipment.' },
  { slug: 'best-gym-in-bangalore-with-personal-trainers-and-modern-equipment', img: 'blog-best-gym', title: 'Best Gym in Bangalore With Personal Trainers and Modern Equipment', excerpt: 'Expert coaching, advanced equipment and structured workouts in one place.' },
  { slug: 'things-to-check-before-joining-a-premium-gym-in-indiranagar', img: 'blog-premium-checklist', title: 'Things to Check Before Joining a Premium Gym in Indiranagar', excerpt: 'A checklist for choosing an environment that supports your long-term goals.' },
  { slug: 'best-personal-training-in-indiranagar-for-busy-working-professionals', img: 'blog-pt-professionals', title: 'Best Personal Training in Indiranagar for Busy Working Professionals', excerpt: 'Long hours and meetings make consistency hard. Personal training changes that.' },
];

// Footer contacts exactly as labelled on the current site.
export const contacts = [
  { label: 'Elite Club Indiranagar', phone: '7899513757' },
  { label: 'Luxury Club Indiranagar', phone: '08147475647' },
  { label: 'Fitness Club Koramangala', phone: '08147475647' },
  { label: 'Fitness Club Brigade Road', phone: '6366743301' },
  { label: 'Ultra Luxury', phone: '09916285341' },
];

export const blogUrl = (slug) => `${brand.domain}/${slug}/`;
export const telHref = (phone) => `tel:+91${phone.replace(/^0/, '').slice(-10)}`;
export const waHref = (number, text = brand.whatsappText) => `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
export const mapsHref = (loc) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${loc.name}, ${loc.address}`)}`;
