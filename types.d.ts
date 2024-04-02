type PageInfoProps = {
  startCursor: string
  endCursor: string
  hasNextPage: boolean
  hasPreviousPage: boolean
}

type BlogProps = {
  id: number
  title: string
  description: string
  imageUrl: string
  postDate: string
  blogCategories: Array<{
    id: number
    name: string
  }>
}

type BlogCategoryProps = {
  id: number
  title: string
  description: string
  blogs: Array<BlogProps>
  pageInfo: PageInfoProps | null
}

type ImpactStoryProps = {
  id: number
  title: string
  description: string
  imageUrl: string
  postDate: string
}

type MemberProps = {
  id: number
  name: string
  description: string
  imageUrl: string
  memberCategories: Array<{
    id: number
    name: string
  }>
}

type MemberCategoryProps = {
  id: number
  name: string
  description: string
  members: Array<MemberProps>
  pageInfo: PageInfoProps | null
}

type NewsEventProps = {
  id: number
  title: string
  description: string
  imageUrl: string
  postDate: string
}

type PublicationProps = {
  id: number
  title: string
  actionPoint: string
  description: string
  fileURL: string
  authorName: string
  postDate: string
  publishDate: string
}

type SubscriptionProps = {
  name: string
  email: string
  message: string
}

type ContentListProps = {
  blogs: BlogProps[]
  impactStories: ImpactStoryProps[]
  members: MemberProps[]
  newsEvents: NewsEventProps[]
  publications: PublicationProps[]
}

type HeroSectionProps = {
  id: number
  sectionTitle: string
  sectionDescription: string | null
  buttonOneText: string | null
  buttonOneLink: string | null
  buttonTwoText: string | null
  buttonTwoLink: string | null
  backgroundImage: string
  slideNumber: number
}

type VideoDataProps = {
  id: number
  title: string
  description: string | null
  youtubeLink: string | null
  video: {
    url: string
    fileSize: number
    fileType: string
  } | null
}

type SocialMediaDataProps = {
  id: number
  name: "Facebook" | "LinkedIn" | "Tumblr" | "Instagram" | "Reddit" | "YouTube" | "TikTok" | "Twitter"
  link: string
}
