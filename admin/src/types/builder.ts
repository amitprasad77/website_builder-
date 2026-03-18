// // // src/types/builder.ts

// // // ─── Component Types ──────────────────────────────────────────────────────────
// // export type ComponentType =
// //   | 'page'
// //   | 'section'
// //   | 'container'
// //   | 'grid'
// //   | 'columns'
// //   | 'navbar'
// //   | 'hero'
// //   | 'heading'
// //   | 'text'
// //   | 'button'
// //   | 'image'
// //   | 'video'
// //   | 'footer';

// // // ─── Component Props ──────────────────────────────────────────────────────────
// // export interface NavbarProps {
// //   logo?: string;
// //   links?: string[];
// //   bgColor?: string;
// // }

// // export interface HeroProps {
// //   title?: string;
// //   subtitle?: string;
// //   bgColor?: string;
// //   bgImage?: string;
// //   buttonText?: string;
// //   buttonHref?: string;
// // }

// // export interface HeadingProps {
// //   text?: string;
// //   fontSize?: string;
// //   alignment?: 'left' | 'center' | 'right';
// //   color?: string;
// // }

// // export interface TextProps {
// //   text?: string;
// //   fontSize?: string;
// //   color?: string;
// // }

// // export interface ButtonProps {
// //   label?: string;
// //   href?: string;
// //   variant?: 'primary' | 'secondary';
// // }

// // export interface ImageProps {
// //   src?: string;
// //   alt?: string;
// //   width?: string;
// // }

// // export interface VideoProps {
// //   src?: string;
// //   poster?: string;
// //   width?: string;
// // }

// // export interface FooterProps {
// //   text?: string;
// //   bgColor?: string;
// //   color?: string;
// // }

// // export interface SectionProps {
// //   padding?: string;
// //   bgColor?: string;
// // }

// // export interface ContainerProps {
// //   maxWidth?: string;
// //   padding?: string;
// // }

// // export interface GridProps {
// //   columns?: number;
// //   gap?: string;
// // }

// // export interface ColumnsProps {
// //   count?: number;
// //   gap?: string;
// // }

// // export type ComponentProps =
// //   | NavbarProps
// //   | HeroProps
// //   | HeadingProps
// //   | TextProps
// //   | ButtonProps
// //   | ImageProps
// //   | VideoProps
// //   | FooterProps
// //   | SectionProps
// //   | ContainerProps
// //   | GridProps
// //   | ColumnsProps
// //   | Record<string, unknown>;

// // // ─── Layout Node ──────────────────────────────────────────────────────────────
// // export interface LayoutNode {
// //   id: string;
// //   type: ComponentType;
// //   props: ComponentProps;
// //   children?: LayoutNode[];
// // }

// // // ─── Template ─────────────────────────────────────────────────────────────────
// // export interface Template {
// //   id?: string;
// //   name: string;
// //   description?: string;
// //   layout: LayoutNode;
// //   thumbnail?: string;
// //   createdAt?: string;
// //   updatedAt?: string;
// // }

// // // ─── Course Data ──────────────────────────────────────────────────────────────
// // export interface Lesson {
// //   id?: string;
// //   title: string;
// //   description?: string;
// //   duration?: string;
// //   videoUrl?: string;
// //   order?: number;
// // }

// // export interface Course {
// //   id?: string;
// //   title: string;
// //   description?: string;
// //   thumbnail?: string;
// //   instructor?: string;
// //   price?: number;
// //   duration?: string;
// //   level?: string;
// //   tags?: string[];
// //   lessons?: Lesson[];
// // }

// // // ─── Website ──────────────────────────────────────────────────────────────────
// // export type WebsiteStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

// // export interface Website {
// //   id?: string;
// //   name: string;
// //   slug: string;
// //   status?: WebsiteStatus;
// //   templateId: string;
// //   course?: Course;
// // }

// // // ─── Builder Store State ──────────────────────────────────────────────────────
// // export interface BuilderState {
// //   page: LayoutNode;
// //   selectedId: string | null;
// //   hoveredId: string | null;
// //   setSelected: (id: string | null) => void;
// //   setHovered: (id: string | null) => void;
// //   addComponent: (type: ComponentType, parentId: string, index?: number) => void;
// //   moveComponent: (nodeId: string, targetParentId: string, targetIndex: number | null) => void;
// //   updateProps: (id: string, props: Partial<ComponentProps>) => void;
// //   deleteComponent: (id: string) => void;
// //   duplicateComponent: (id: string) => void;
// //   clearPage: () => void;
// //   loadPage: (page: LayoutNode) => void;
// // }

// // // ─── Panel Component Item ─────────────────────────────────────────────────────
// // export interface PanelItem {
// //   type: ComponentType;
// //   label: string;
// //   icon: string;
// // }

// // export interface PanelGroup {
// //   label: string;
// //   items: PanelItem[];
// // }



// // src/types/builder.ts

// export type ComponentType =
//   | 'page'
//   | 'section'
//   | 'container'
//   | 'grid'
//   | 'columns'
//   | 'heading'
//   | 'text'
//   | 'image'
//   | 'button'
//   | 'video'
//   | 'navbar'
//   | 'hero'
//   | 'footer';

// export interface LayoutNode {
//   id: string;
//   type: ComponentType;
//   props: ComponentProps;
//   children?: LayoutNode[];
// }

// export type ComponentProps = Record<string, any>;

// export interface NavbarProps { logo: string; links: string[]; bgColor: string; }
// export interface HeroProps { title: string; subtitle: string; bgColor: string; buttonText?: string; buttonHref?: string; }
// export interface HeadingProps { text: string; fontSize: string; alignment: string; color: string; }
// export interface TextProps { text: string; fontSize: string; color: string; }
// export interface ButtonProps { label: string; variant: 'primary' | 'outline'; href: string; }
// export interface ImageProps { src: string; alt: string; width: string; }
// export interface VideoProps { src: string; width: string; }
// export interface FooterProps { text: string; bgColor: string; color: string; }
// export interface SectionProps { padding: string; bgColor: string; }
// export interface ContainerProps { maxWidth: string; padding: string; }
// export interface GridProps { columns: number; gap: string; }
// export interface ColumnsProps { count: number; gap: string; }

// export interface BuilderState {
//   page: LayoutNode;
//   selectedId: string | null;
//   hoveredId: string | null;
//   setSelected: (id: string | null) => void;
//   setHovered: (id: string | null) => void;
//   addComponent: (type: ComponentType, parentId: string, index?: number) => void;
//   moveComponent: (nodeId: string, targetParentId: string, targetIndex: number | null) => void;
//   moveComponentBeforeAfter: (sourceId: string, targetId: string, position: 'before' | 'after') => void;
//   updateProps: (id: string, props: Partial<ComponentProps>) => void;
//   deleteComponent: (id: string) => void;
//   duplicateComponent: (id: string) => void;
//   clearPage: () => void;
//   loadPage: (page: LayoutNode) => void;
// }

// export interface Template {
//   id: string;
//   name: string;
//   description?: string;
//   layout: LayoutNode;
//   thumbnail?: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface PanelItem {
//   type: string;
//   label: string;
//   icon: string;
// }

// export interface PanelGroup {
//   label: string;
//   items: PanelItem[];
// }


// src/types/builder.ts

export type ComponentType =
  // Layout
  | 'page'
  | 'section'
  | 'container'
  | 'grid'
  | 'columns'
  // Content
  | 'heading'
  | 'text'
  | 'image'
  | 'button'
  | 'video'
  | 'divider'
  | 'spacer'
  | 'badge'
  | 'codeblock'
  // Composite
  | 'testimonial'
  | 'pricing'
  | 'faq'
  | 'progress'
  | 'icontext'
  // Website
  | 'navbar'
  | 'hero'
  | 'footer';

export interface LayoutNode {
  id: string;
  type: ComponentType;
  props: ComponentProps;
  children?: LayoutNode[];
}

export type ComponentProps = Record<string, any>;

// ─── Prop interfaces ──────────────────────────────────────────────────────────
export interface NavbarProps { logo: string; links: string[]; bgColor: string; }
export interface HeroProps { title: string; subtitle: string; bgColor: string; buttonText?: string; buttonHref?: string; bgImage?: string; }
export interface HeadingProps { text: string; fontSize: string; alignment: string; color: string; }
export interface TextProps { text: string; fontSize: string; color: string; alignment?: string; }
export interface ButtonProps { label: string; variant: 'primary' | 'outline'; href: string; alignment?: string; bgColor?: string; color?: string; borderRadius?: string; padding?: string; fontSize?: string; }
export interface ImageProps { src: string; alt: string; width: string; alignment?: string; borderRadius?: string; }
export interface VideoProps { src: string; width: string; }
export interface FooterProps { text: string; bgColor: string; color: string; alignment?: string; }
export interface SectionProps { padding: string; bgColor: string; textAlign?: string; }
export interface ContainerProps { maxWidth: string; padding: string; }
export interface GridProps { columns: number; gap: string; }
export interface ColumnsProps { gap: string; }
export interface DividerProps { color: string; thickness: string; margin: string; }
export interface SpacerProps { height: string; }
export interface BadgeProps { text: string; bgColor: string; color: string; borderRadius: string; }
export interface TestimonialProps { quote: string; author: string; role: string; avatar?: string; bgColor: string; }
export interface PricingProps { title: string; price: string; period: string; features: string[]; buttonText: string; highlighted: boolean; }
export interface FaqProps { question: string; answer: string; }
export interface ProgressProps { label: string; value: number; color: string; bgColor: string; }
export interface IconTextProps { icon: string; title: string; text: string; }
export interface CodeBlockProps { code: string; language: string; }

// ─── Builder State ────────────────────────────────────────────────────────────
export interface BuilderState {
  page: LayoutNode;
  selectedId: string | null;
  hoveredId: string | null;
  setSelected: (id: string | null) => void;
  setHovered: (id: string | null) => void;
  addComponent: (type: ComponentType, parentId: string, index?: number) => void;
  moveComponent: (nodeId: string, targetParentId: string, targetIndex: number | null) => void;
  moveComponentBeforeAfter: (sourceId: string, targetId: string, position: 'before' | 'after') => void;
  updateProps: (id: string, props: Partial<ComponentProps>) => void;
  deleteComponent: (id: string) => void;
  duplicateComponent: (id: string) => void;
  clearPage: () => void;
  loadPage: (page: LayoutNode) => void;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  layout: LayoutNode;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PanelItem {
  type: string;
  label: string;
  icon: string;
}

export interface PanelGroup {
  label: string;
  items: PanelItem[];
}