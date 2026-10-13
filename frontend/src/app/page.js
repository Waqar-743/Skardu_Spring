import StoryStage from '@/components/story/StoryStage';
import EditorialReveal from '@/components/story/EditorialReveal';
import JourneyMarquee from '@/components/story/JourneyMarquee';
import Collection from '@/components/story/Collection';

export default function Home() {
  return (
    <>
      <StoryStage />
      <EditorialReveal />
      <JourneyMarquee />
      <Collection />
    </>
  );
}
