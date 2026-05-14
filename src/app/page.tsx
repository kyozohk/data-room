'use client';
import Image from "next/image";
import {Hero, BackgroundImages, SlidingCards, FeatureCard, ScrollRevealText, SlidingCard, ParallaxGallery, VideoWall, Toolkit, Marquee, BubbleMarquee, BottomText, PricingSection, LandingNav} from "../components/landing";
import SpheresLanding from "../components/landing/SpheresLanding";
import {Button as ButtonUI} from "../components/ui";

export default function Home() {
  
  return (
    <div className="container">
      {/* <LandingNav /> */}
      <Hero text="Welcome to Kyozo" />
      <BackgroundImages />
      <FeatureCard />
      <div className="my-80 bg-white" style={{ paddingLeft: '10%', paddingRight: '10%' }}>
        <ScrollRevealText text="Creatives are not creators." />      
      </div>
      <SlidingCards>
        <SlidingCard
          subtitle="INSIDER ACCESS"
          title="We provide the infrastructure. You own the audience."
          text="Experience the creative world through an insider's lens. Kyozo is an eco-system of creative communities - that gives you exclusive access to updates and insights from the creative luminaries driving cultural evolution."
          button={<ButtonUI variant="outline-only" size="medium" href="#">Enter the Dataroom</ButtonUI>}
          content={<VideoWall />}
          backgroundColor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        />
        <SlidingCard
          subtitle="COMMUNITY ACCESS"
          title="Audiences are fragmented. Nothing compounds."
          text="Join and interact with diverse communities, from niche artistic circles to industry-leading collectives. Engage with passionate individuals who share your creative interests."
          button={<ButtonUI variant="outline-only" size="medium" href="#">Enter the Dataroom</ButtonUI>}
          content={<ParallaxGallery />}
          backgroundColor="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
        />
        <SlidingCard
          subtitle="CREATOR TOOLS"
          title="Both sides want the same thing. The infrastructure is missing."
          text="Are you a creative professional, community organizer, or small business owner working within the creative industries? We understand the challenges of nurturing and growing a dedicated audience, so we built KyozoPro, a comprehensive platform that enhances genuine connections and unlocks new opportunities."
          button={<ButtonUI variant="outline-only" size="medium" href="#">Enter the Dataroom</ButtonUI>}
          content={<Image src="/card-3.png" alt="Phone" width={600} height={800} style={{objectFit: 'contain', maxHeight: '100%', maxWidth: '100%'}} />}
          backgroundColor="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
        />        
      </SlidingCards>      
      <Toolkit />
      <Marquee 
          categories={[
            {
              category: 'music',
              items: [
                { text: 'Rediscovering your creative passion' },
                { text: 'Prompts to Turbocharge Your Creative Process' },
                { text: 'BPM heartrate and running' },
                { text: 'The creative paradox' },
                { text: 'Rediscovering your creative passion' },
              ]
            },           
          ]}
        />
      
      <PricingSection />      
     <BubbleMarquee
          categories={[
            {
              category: 'inbox',
              items: [ { text: 'Dance' }, { text: 'Music' }, { text: 'House' }, { text: 'Techno' }, { text: 'Trance' }]
            },
            {
              category: 'overview',
              items: [ { text: 'Contemporary' }, { text: 'Surrealism' }, { text: 'Impressionism' }, { text: 'Art' }, { text: 'Cubism' }]
            },
            {
              category: 'broadcast',
              items: [ { text: 'Craft' }, { text: 'Pottery' }, { text: 'Drawing' }, { text: 'Painting' }, { text: 'Jewelry' }]
            },
            {
              category: 'members',
              items: [ { text: 'Haute Couture' }, { text: 'Fashion' }, { text: 'Streetwear' }, { text: 'Boho' }, { text: 'Avant Garde' }]
            },
            {
              category: 'feed',
              items: [ { text: 'Electronic' }, { text: 'Dance' }, { text: 'Performance' }, { text: 'House' }, { text: 'Techno' }, { text: 'Trance' }]
            }
          ]}
        /> 
      <BottomText text="Join the creative universe" fontSize="6rem" fontWeight={700} />
    </div>
  );
}
