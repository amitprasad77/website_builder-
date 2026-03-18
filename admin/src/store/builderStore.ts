// // // // src/store/builderStore.ts
// // // import { create } from 'zustand';
// // // import { nanoid } from 'nanoid';
// // // import type{
// // //   BuilderState,
// // //   ComponentType,
// // //   ComponentProps,
// // //   LayoutNode,
// // // } from '../types/builder';

// // // // ─── Default empty page ───────────────────────────────────────────────────────
// // // const defaultPage: LayoutNode = {
// // //   id: 'page-root',
// // //   type: 'page',
// // //   props: {},
// // //   children: [],
// // // };

// // // // ─── Container types (can have children) ─────────────────────────────────────
// // // const CONTAINER_TYPES: ComponentType[] = [
// // //   'page',
// // //   'section',
// // //   'container',
// // //   'grid',
// // //   'columns',
// // // ];

// // // export const isContainer = (type: ComponentType): boolean =>
// // //   CONTAINER_TYPES.includes(type);

// // // // ─── Default props per component type ────────────────────────────────────────
// // // function getDefaultProps(type: ComponentType): ComponentProps {
// // //   const defaults: Partial<Record<ComponentType, ComponentProps>> = {
// // //     heading: {
// // //       text: 'Heading',
// // //       fontSize: '2rem',
// // //       alignment: 'left',
// // //       color: '#111111',
// // //     },
// // //     text: {
// // //       text: 'Write something here...',
// // //       fontSize: '1rem',
// // //       color: '#444444',
// // //     },
// // //     button: {
// // //       label: 'Click Me',
// // //       variant: 'primary',
// // //       href: '#',
// // //     },
// // //     image: {
// // //       src: 'https://placehold.co/600x300',
// // //       alt: 'Image',
// // //       width: '100%',
// // //     },
// // //     video: {
// // //       src: '',
// // //       width: '100%',
// // //     },
// // //     navbar: {
// // //       logo: '{{course.title}}',
// // //       links: ['Home', 'About', 'Contact'],
// // //       bgColor: '#ffffff',
// // //     },
// // //     hero: {
// // //       title: '{{course.title}}',
// // //       subtitle: '{{course.description}}',
// // //       bgColor: '#1a1a2e',
// // //       buttonText: 'Get Started',
// // //       buttonHref: '#',
// // //     },
// // //     footer: {
// // //       text: '© 2025 {{course.title}}. All rights reserved.',
// // //       bgColor: '#111111',
// // //       color: '#ffffff',
// // //     },
// // //     section: {
// // //       padding: '60px 40px',
// // //       bgColor: 'transparent',
// // //     },
// // //     container: {
// // //       maxWidth: '1200px',
// // //       padding: '0 20px',
// // //     },
// // //     grid: {
// // //       columns: 3,
// // //       gap: '24px',
// // //     },
// // //     columns: {
// // //       count: 2,
// // //       gap: '24px',
// // //     },
// // //   };
// // //   return defaults[type] || {};
// // // }

// // // // ─── Tree helpers ─────────────────────────────────────────────────────────────
// // // function createNode(type: ComponentType): LayoutNode {
// // //   return {
// // //     id: nanoid(8),
// // //     type,
// // //     props: getDefaultProps(type),
// // //     children: isContainer(type) ? [] : undefined,
// // //   };
// // // }

// // // function findNode(node: LayoutNode, id: string): LayoutNode | null {
// // //   if (node.id === id) return node;
// // //   if (!node.children) return null;
// // //   for (const child of node.children) {
// // //     const found = findNode(child, id);
// // //     if (found) return found;
// // //   }
// // //   return null;
// // // }

// // // function findParent(node: LayoutNode, id: string): LayoutNode | null {
// // //   if (!node.children) return null;
// // //   for (const child of node.children) {
// // //     if (child.id === id) return node;
// // //     const found = findParent(child, id);
// // //     if (found) return found;
// // //   }
// // //   return null;
// // // }

// // // function insertNode(
// // //   tree: LayoutNode,
// // //   parentId: string,
// // //   newNode: LayoutNode,
// // //   index: number | null
// // // ): LayoutNode {
// // //   if (tree.id === parentId) {
// // //     const children = [...(tree.children || [])];
// // //     if (index === null || index === undefined) {
// // //       children.push(newNode);
// // //     } else {
// // //       children.splice(index, 0, newNode);
// // //     }
// // //     return { ...tree, children };
// // //   }
// // //   if (!tree.children) return tree;
// // //   return {
// // //     ...tree,
// // //     children: tree.children.map((child) =>
// // //       insertNode(child, parentId, newNode, index)
// // //     ),
// // //   };
// // // }

// // // function removeNode(tree: LayoutNode, id: string): LayoutNode {
// // //   if (!tree.children) return tree;
// // //   return {
// // //     ...tree,
// // //     children: tree.children
// // //       .filter((child) => child.id !== id)
// // //       .map((child) => removeNode(child, id)),
// // //   };
// // // }

// // // function updateNodeProps(
// // //   tree: LayoutNode,
// // //   id: string,
// // //   props: Partial<ComponentProps>
// // // ): LayoutNode {
// // //   if (tree.id === id) {
// // //     return { ...tree, props: { ...tree.props, ...props } };
// // //   }
// // //   if (!tree.children) return tree;
// // //   return {
// // //     ...tree,
// // //     children: tree.children.map((child) =>
// // //       updateNodeProps(child, id, props)
// // //     ),
// // //   };
// // // }

// // // function deepClone(node: LayoutNode): LayoutNode {
// // //   const cloned: LayoutNode = {
// // //     ...node,
// // //     id: nanoid(8),
// // //     props: { ...node.props },
// // //   };
// // //   if (node.children) {
// // //     cloned.children = node.children.map(deepClone);
// // //   }
// // //   return cloned;
// // // }

// // // // ─── Zustand Store ────────────────────────────────────────────────────────────
// // // export const useBuilderStore = create<BuilderState>((set, get) => ({
// // //   page: defaultPage,
// // //   selectedId: null,
// // //   hoveredId: null,

// // //   setSelected: (id) => set({ selectedId: id }),

// // //   setHovered: (id) => set({ hoveredId: id }),

// // //   addComponent: (type, parentId, index = undefined) => {
// // //     const newNode = createNode(type);
// // //     set((state) => ({
// // //       page: insertNode(state.page, parentId, newNode, index ?? null),
// // //       selectedId: newNode.id,
// // //     }));
// // //   },

// // //   moveComponent: (nodeId, targetParentId, targetIndex) => {
// // //     set((state) => {
// // //       const node = findNode(state.page, nodeId);
// // //       if (!node) return state;
// // //       const pageWithout = removeNode(state.page, nodeId);
// // //       const pageWith = insertNode(pageWithout, targetParentId, node, targetIndex);
// // //       return { page: pageWith };
// // //     });
// // //   },

// // //   updateProps: (id, props) => {
// // //     set((state) => ({
// // //       page: updateNodeProps(state.page, id, props),
// // //     }));
// // //   },

// // //   deleteComponent: (id) => {
// // //     set((state) => ({
// // //       page: removeNode(state.page, id),
// // //       selectedId: state.selectedId === id ? null : state.selectedId,
// // //     }));
// // //   },

// // //   duplicateComponent: (id) => {
// // //     const node = findNode(get().page, id);
// // //     if (!node) return;
// // //     const parent = findParent(get().page, id);
// // //     if (!parent) return;
// // //     const cloned = deepClone(node);
// // //     const idx = parent.children?.findIndex((c) => c.id === id) ?? 0;
// // //     set((state) => ({
// // //       page: insertNode(state.page, parent.id, cloned, idx + 1),
// // //       selectedId: cloned.id,
// // //     }));
// // //   },

// // //   clearPage: () => set({ page: defaultPage, selectedId: null }),

// // //   loadPage: (page) => set({ page, selectedId: null }),
// // // }));
// // // src/store/builderStore.ts
// // import { create } from 'zustand';
// // import { nanoid } from 'nanoid';
// // import type {
// //   BuilderState,
// //   ComponentType,
// //   ComponentProps,
// //   LayoutNode,
// // } from '../types/builder';

// // // ─── Default empty page ───────────────────────────────────────────────────────
// // const defaultPage: LayoutNode = {
// //   id: 'page-root',
// //   type: 'page',
// //   props: {},
// //   children: [],
// // };

// // // ─── Container types (can have children) ─────────────────────────────────────
// // const CONTAINER_TYPES: ComponentType[] = [
// //   'page',
// //   'section',
// //   'container',
// //   'grid',
// //   'columns',
// // ];

// // export const isContainer = (type: ComponentType): boolean =>
// //   CONTAINER_TYPES.includes(type);

// // // ─── Default props per component type ────────────────────────────────────────
// // function getDefaultProps(type: ComponentType): ComponentProps {
// //   const defaults: Partial<Record<ComponentType, ComponentProps>> = {
// //     heading: {
// //       text: 'Heading',
// //       fontSize: '2rem',
// //       alignment: 'left',
// //       color: '#111111',
// //     },
// //     text: {
// //       text: 'Write something here...',
// //       fontSize: '1rem',
// //       color: '#444444',
// //     },
// //     button: {
// //       label: 'Click Me',
// //       variant: 'primary',
// //       href: '#',
// //     },
// //     image: {
// //       src: 'https://placehold.co/600x300',
// //       alt: 'Image',
// //       width: '100%',
// //     },
// //     video: {
// //       src: '',
// //       width: '100%',
// //     },
// //     navbar: {
// //       logo: '{{course.title}}',
// //       links: ['Home', 'About', 'Contact'],
// //       bgColor: '#ffffff',
// //     },
// //     hero: {
// //       title: '{{course.title}}',
// //       subtitle: '{{course.description}}',
// //       bgColor: '#1a1a2e',
// //       buttonText: 'Get Started',
// //       buttonHref: '#',
// //     },
// //     footer: {
// //       text: '© 2025 {{course.title}}. All rights reserved.',
// //       bgColor: '#111111',
// //       color: '#ffffff',
// //     },
// //     section: {
// //       padding: '60px 40px',
// //       bgColor: 'transparent',
// //     },
// //     container: {
// //       maxWidth: '1200px',
// //       padding: '0 20px',
// //     },
// //     grid: {
// //       columns: 3,
// //       gap: '24px',
// //     },
// //     columns: {
// //       count: 2,
// //       gap: '24px',
// //     },
// //   };
// //   return defaults[type] || {};
// // }

// // // ─── Tree helpers ─────────────────────────────────────────────────────────────
// // function createNode(type: ComponentType): LayoutNode {
// //   return {
// //     id: nanoid(8),
// //     type,
// //     props: getDefaultProps(type),
// //     children: isContainer(type) ? [] : undefined,
// //   };
// // }

// // function findNode(node: LayoutNode, id: string): LayoutNode | null {
// //   if (node.id === id) return node;
// //   if (!node.children) return null;
// //   for (const child of node.children) {
// //     const found = findNode(child, id);
// //     if (found) return found;
// //   }
// //   return null;
// // }

// // function findParent(node: LayoutNode, id: string): LayoutNode | null {
// //   if (!node.children) return null;
// //   for (const child of node.children) {
// //     if (child.id === id) return node;
// //     const found = findParent(child, id);
// //     if (found) return found;
// //   }
// //   return null;
// // }

// // function insertNode(
// //   tree: LayoutNode,
// //   parentId: string,
// //   newNode: LayoutNode,
// //   index: number | null
// // ): LayoutNode {
// //   if (tree.id === parentId) {
// //     const children = [...(tree.children || [])];
// //     if (index === null || index === undefined) {
// //       children.push(newNode);
// //     } else {
// //       children.splice(index, 0, newNode);
// //     }
// //     return { ...tree, children };
// //   }
// //   if (!tree.children) return tree;
// //   return {
// //     ...tree,
// //     children: tree.children.map((child) =>
// //       insertNode(child, parentId, newNode, index)
// //     ),
// //   };
// // }

// // function removeNode(tree: LayoutNode, id: string): LayoutNode {
// //   if (!tree.children) return tree;
// //   return {
// //     ...tree,
// //     children: tree.children
// //       .filter((child) => child.id !== id)
// //       .map((child) => removeNode(child, id)),
// //   };
// // }

// // function updateNodeProps(
// //   tree: LayoutNode,
// //   id: string,
// //   props: Partial<ComponentProps>
// // ): LayoutNode {
// //   if (tree.id === id) {
// //     return { ...tree, props: { ...tree.props, ...props } };
// //   }
// //   if (!tree.children) return tree;
// //   return {
// //     ...tree,
// //     children: tree.children.map((child) =>
// //       updateNodeProps(child, id, props)
// //     ),
// //   };
// // }

// // function deepClone(node: LayoutNode): LayoutNode {
// //   const cloned: LayoutNode = {
// //     ...node,
// //     id: nanoid(8),
// //     props: { ...node.props },
// //   };
// //   if (node.children) {
// //     cloned.children = node.children.map(deepClone);
// //   }
// //   return cloned;
// // }

// // // ─── Zustand Store ────────────────────────────────────────────────────────────
// // export const useBuilderStore = create<BuilderState>((set, get) => ({
// //   page: defaultPage,
// //   selectedId: null,
// //   hoveredId: null,

// //   setSelected: (id) => set({ selectedId: id }),

// //   setHovered: (id) => set({ hoveredId: id }),

// //   addComponent: (type, parentId, index = undefined) => {
// //     const newNode = createNode(type);
// //     set((state) => ({
// //       page: insertNode(state.page, parentId, newNode, index ?? null),
// //       selectedId: newNode.id,
// //     }));
// //   },

// //   moveComponent: (nodeId, targetParentId, targetIndex) => {
// //     set((state) => {
// //       const node = findNode(state.page, nodeId);
// //       if (!node) return state;
// //       const pageWithout = removeNode(state.page, nodeId);
// //       const pageWith = insertNode(pageWithout, targetParentId, node, targetIndex);
// //       return { page: pageWith };
// //     });
// //   },

// //   updateProps: (id, props) => {
// //     set((state) => ({
// //       page: updateNodeProps(state.page, id, props),
// //     }));
// //   },

// //   deleteComponent: (id) => {
// //     set((state) => ({
// //       page: removeNode(state.page, id),
// //       selectedId: state.selectedId === id ? null : state.selectedId,
// //     }));
// //   },

// //   duplicateComponent: (id) => {
// //     const node = findNode(get().page, id);
// //     if (!node) return;
// //     const parent = findParent(get().page, id);
// //     if (!parent) return;
// //     const cloned = deepClone(node);
// //     const idx = parent.children?.findIndex((c) => c.id === id) ?? 0;
// //     set((state) => ({
// //       page: insertNode(state.page, parent.id, cloned, idx + 1),
// //       selectedId: cloned.id,
// //     }));
// //   },

// //   clearPage: () => set({ page: defaultPage, selectedId: null }),

// //   loadPage: (page) => set({ page, selectedId: null }),
// // }));



// // src/store/builderStore.ts
// import { create } from 'zustand';
// import { nanoid } from 'nanoid';
// import type { BuilderState, ComponentType, ComponentProps, LayoutNode } from '../types/builder';

// const defaultPage: LayoutNode = {
//   id: 'page-root',
//   type: 'page',
//   props: {},
//   children: [],
// };

// const CONTAINER_TYPES: ComponentType[] = ['page', 'section', 'container', 'grid', 'columns'];

// export const isContainer = (type: ComponentType): boolean => CONTAINER_TYPES.includes(type);

// function getDefaultProps(type: ComponentType): ComponentProps {
//   const defaults: Partial<Record<ComponentType, ComponentProps>> = {
//     heading: { text: 'Heading', fontSize: '2rem', alignment: 'left', color: '#111111' },
//     text: { text: 'Write something here...', fontSize: '1rem', color: '#444444' },
//     button: { label: 'Click Me', variant: 'primary', href: '#' },
//     image: { src: 'https://placehold.co/600x300', alt: 'Image', width: '100%' },
//     video: { src: '', width: '100%' },
//     navbar: { logo: '{{course.title}}', links: ['Home', 'About', 'Contact'], bgColor: '#ffffff' },
//     hero: { title: '{{course.title}}', subtitle: '{{course.description}}', bgColor: '#1a1a2e', buttonText: 'Get Started', buttonHref: '#' },
//     footer: { text: '© 2025 {{course.title}}. All rights reserved.', bgColor: '#111111', color: '#ffffff' },
//     section: { padding: '60px 40px', bgColor: 'transparent' },
//     container: { maxWidth: '1200px', padding: '0 20px' },
//     grid: { columns: 3, gap: '24px' },
//     columns: { count: 2, gap: '24px' },
//   };
//   return defaults[type] || {};
// }

// function createNode(type: ComponentType): LayoutNode {
//   return {
//     id: nanoid(8),
//     type,
//     props: getDefaultProps(type),
//     children: isContainer(type) ? [] : undefined,
//   };
// }

// function findNode(node: LayoutNode, id: string): LayoutNode | null {
//   if (node.id === id) return node;
//   if (!node.children) return null;
//   for (const child of node.children) {
//     const found = findNode(child, id);
//     if (found) return found;
//   }
//   return null;
// }

// function findParent(node: LayoutNode, id: string): LayoutNode | null {
//   if (!node.children) return null;
//   for (const child of node.children) {
//     if (child.id === id) return node;
//     const found = findParent(child, id);
//     if (found) return found;
//   }
//   return null;
// }

// function insertNode(tree: LayoutNode, parentId: string, newNode: LayoutNode, index: number | null): LayoutNode {
//   if (tree.id === parentId) {
//     const children = [...(tree.children || [])];
//     if (index === null || index === undefined) {
//       children.push(newNode);
//     } else {
//       children.splice(index, 0, newNode);
//     }
//     return { ...tree, children };
//   }
//   if (!tree.children) return tree;
//   return { ...tree, children: tree.children.map(c => insertNode(c, parentId, newNode, index)) };
// }

// function removeNode(tree: LayoutNode, id: string): LayoutNode {
//   if (!tree.children) return tree;
//   return {
//     ...tree,
//     children: tree.children.filter(c => c.id !== id).map(c => removeNode(c, id)),
//   };
// }

// function updateNodeProps(tree: LayoutNode, id: string, props: Partial<ComponentProps>): LayoutNode {
//   if (tree.id === id) return { ...tree, props: { ...tree.props, ...props } };
//   if (!tree.children) return tree;
//   return { ...tree, children: tree.children.map(c => updateNodeProps(c, id, props)) };
// }

// function deepClone(node: LayoutNode): LayoutNode {
//   return {
//     ...node,
//     id: nanoid(8),
//     props: { ...node.props },
//     children: node.children?.map(deepClone),
//   };
// }

// // ─── Key fix: move node before/after a sibling ─────────────────────────────
// function moveNodeBeforeAfter(
//   tree: LayoutNode,
//   sourceId: string,
//   targetId: string,
//   position: 'before' | 'after'
// ): LayoutNode {
//   // Find the source node first
//   const sourceNode = findNode(tree, sourceId);
//   if (!sourceNode) return tree;

//   // Remove source from tree
//   const treeWithout = removeNode(tree, sourceId);

//   // Find target's parent in the new tree
//   const targetParent = findParent(treeWithout, targetId);
//   if (!targetParent || !targetParent.children) return tree;

//   // Find target index
//   const targetIndex = targetParent.children.findIndex(c => c.id === targetId);
//   if (targetIndex === -1) return tree;

//   const insertIndex = position === 'before' ? targetIndex : targetIndex + 1;

//   return insertNode(treeWithout, targetParent.id, sourceNode, insertIndex);
// }

// export const useBuilderStore = create<BuilderState>((set, get) => ({
//   page: defaultPage,
//   selectedId: null,
//   hoveredId: null,

//   setSelected: (id) => set({ selectedId: id }),
//   setHovered: (id) => set({ hoveredId: id }),

//   addComponent: (type, parentId, index = undefined) => {
//     const newNode = createNode(type);
//     set(state => ({
//       page: insertNode(state.page, parentId, newNode, index ?? null),
//       selectedId: newNode.id,
//     }));
//   },

//   moveComponent: (nodeId, targetParentId, targetIndex) => {
//     set(state => {
//       const node = findNode(state.page, nodeId);
//       if (!node) return state;
//       const pageWithout = removeNode(state.page, nodeId);
//       const pageWith = insertNode(pageWithout, targetParentId, node, targetIndex);
//       return { page: pageWith };
//     });
//   },

//   // New action: move before or after a specific sibling
//   moveComponentBeforeAfter: (sourceId, targetId, position) => {
//     set(state => ({
//       page: moveNodeBeforeAfter(state.page, sourceId, targetId, position),
//     }));
//   },

//   updateProps: (id, props) => {
//     set(state => ({ page: updateNodeProps(state.page, id, props) }));
//   },

//   deleteComponent: (id) => {
//     set(state => ({
//       page: removeNode(state.page, id),
//       selectedId: state.selectedId === id ? null : state.selectedId,
//     }));
//   },

//   duplicateComponent: (id) => {
//     const node = findNode(get().page, id);
//     if (!node) return;
//     const parent = findParent(get().page, id);
//     if (!parent) return;
//     const cloned = deepClone(node);
//     const idx = parent.children?.findIndex(c => c.id === id) ?? 0;
//     set(state => ({
//       page: insertNode(state.page, parent.id, cloned, idx + 1),
//       selectedId: cloned.id,
//     }));
//   },

//   clearPage: () => set({ page: defaultPage, selectedId: null }),
//   loadPage: (page) => set({ page, selectedId: null }),
// }));

// src/store/builderStore.ts
import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { BuilderState, ComponentType, ComponentProps, LayoutNode } from '../types/builder';

const defaultPage: LayoutNode = {
  id: 'page-root',
  type: 'page',
  props: {},
  children: [],
};

const CONTAINER_TYPES: ComponentType[] = ['page', 'section', 'container', 'grid', 'columns'];
export const isContainer = (type: ComponentType): boolean => CONTAINER_TYPES.includes(type);

function getDefaultProps(type: ComponentType): ComponentProps {
  const defaults: Partial<Record<ComponentType, ComponentProps>> = {
    heading: { text: 'Heading', fontSize: '2rem', alignment: 'left', color: '#111111' },
    text: { text: 'Write something here...', fontSize: '1rem', color: '#444444', alignment: 'left' },
    button: { label: 'Click Me', variant: 'primary', href: '#', alignment: 'left', bgColor: '#6c63ff', color: '#ffffff', borderRadius: '8px', padding: '12px 28px', fontSize: '14px' },
    image: { src: 'https://placehold.co/600x300', alt: 'Image', width: '100%', alignment: 'left', borderRadius: '0px' },
    video: { src: '', width: '100%' },
    divider: { color: '#e5e7eb', thickness: '1px', margin: '16px 0' },
    spacer: { height: '40px' },
    badge: { text: 'New', bgColor: '#6c63ff22', color: '#6c63ff', borderRadius: '20px' },
    testimonial: { quote: 'This product changed my life!', author: 'John Doe', role: 'CEO, Company', avatar: '', bgColor: '#f9f9f9' },
    pricing: { title: 'Pro Plan', price: '$49', period: '/month', features: ['Feature 1', 'Feature 2', 'Feature 3'], buttonText: 'Get Started', highlighted: false },
    faq: { question: 'What is this product?', answer: 'This is an amazing product that helps you build websites.' },
    progress: { label: 'React', value: 85, color: '#6c63ff', bgColor: '#e5e7eb' },
    icontext: { icon: '⚡', title: 'Fast Performance', text: 'Built for speed and reliability.' },
    codeblock: { code: 'console.log("Hello World")', language: 'javascript' },
    navbar: { logo: '{{course.title}}', links: ['Home', 'About', 'Contact'], bgColor: '#ffffff' },
    hero: { title: '{{course.title}}', subtitle: '{{course.description}}', bgColor: '#1a1a2e', buttonText: 'Get Started', buttonHref: '#' },
    footer: { text: '© 2025 {{course.title}}. All rights reserved.', bgColor: '#111111', color: '#ffffff', alignment: 'center' },
    section: { padding: '60px 40px', bgColor: 'transparent' },
    container: { maxWidth: '1200px', padding: '0 20px' },
    grid: { columns: 3, gap: '24px' },
    columns: { gap: '24px' },
  };
  return defaults[type] || {};
}

function createNode(type: ComponentType): LayoutNode {
  return {
    id: nanoid(8),
    type,
    props: getDefaultProps(type),
    children: isContainer(type) ? [] : undefined,
  };
}

function findNode(node: LayoutNode, id: string): LayoutNode | null {
  if (node.id === id) return node;
  if (!node.children) return null;
  for (const child of node.children) {
    const found = findNode(child, id);
    if (found) return found;
  }
  return null;
}

function findParent(node: LayoutNode, id: string): LayoutNode | null {
  if (!node.children) return null;
  for (const child of node.children) {
    if (child.id === id) return node;
    const found = findParent(child, id);
    if (found) return found;
  }
  return null;
}

function insertNode(tree: LayoutNode, parentId: string, newNode: LayoutNode, index: number | null): LayoutNode {
  if (tree.id === parentId) {
    const children = [...(tree.children || [])];
    if (index === null || index === undefined) children.push(newNode);
    else children.splice(index, 0, newNode);
    return { ...tree, children };
  }
  if (!tree.children) return tree;
  return { ...tree, children: tree.children.map(c => insertNode(c, parentId, newNode, index)) };
}

function removeNode(tree: LayoutNode, id: string): LayoutNode {
  if (!tree.children) return tree;
  return {
    ...tree,
    children: tree.children.filter(c => c.id !== id).map(c => removeNode(c, id)),
  };
}

function updateNodeProps(tree: LayoutNode, id: string, props: Partial<ComponentProps>): LayoutNode {
  if (tree.id === id) return { ...tree, props: { ...tree.props, ...props } };
  if (!tree.children) return tree;
  return { ...tree, children: tree.children.map(c => updateNodeProps(c, id, props)) };
}

function deepClone(node: LayoutNode): LayoutNode {
  return { ...node, id: nanoid(8), props: { ...node.props }, children: node.children?.map(deepClone) };
}

function moveNodeBeforeAfter(tree: LayoutNode, sourceId: string, targetId: string, position: 'before' | 'after'): LayoutNode {
  const sourceNode = findNode(tree, sourceId);
  if (!sourceNode) return tree;
  const treeWithout = removeNode(tree, sourceId);
  const targetParent = findParent(treeWithout, targetId);
  if (!targetParent || !targetParent.children) return tree;
  const targetIndex = targetParent.children.findIndex(c => c.id === targetId);
  if (targetIndex === -1) return tree;
  const insertIndex = position === 'before' ? targetIndex : targetIndex + 1;
  return insertNode(treeWithout, targetParent.id, sourceNode, insertIndex);
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  page: defaultPage,
  selectedId: null,
  hoveredId: null,

  setSelected: (id) => set({ selectedId: id }),
  setHovered: (id) => set({ hoveredId: id }),

  addComponent: (type, parentId, index = undefined) => {
    const newNode = createNode(type);
    set(state => ({
      page: insertNode(state.page, parentId, newNode, index ?? null),
      selectedId: newNode.id,
    }));
  },

  moveComponent: (nodeId, targetParentId, targetIndex) => {
    set(state => {
      const node = findNode(state.page, nodeId);
      if (!node) return state;
      const pageWithout = removeNode(state.page, nodeId);
      const pageWith = insertNode(pageWithout, targetParentId, node, targetIndex);
      return { page: pageWith };
    });
  },

  moveComponentBeforeAfter: (sourceId, targetId, position) => {
    set(state => ({
      page: moveNodeBeforeAfter(state.page, sourceId, targetId, position),
    }));
  },

  updateProps: (id, props) => {
    set(state => ({ page: updateNodeProps(state.page, id, props) }));
  },

  deleteComponent: (id) => {
    set(state => ({
      page: removeNode(state.page, id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    }));
  },

  duplicateComponent: (id) => {
    const node = findNode(get().page, id);
    if (!node) return;
    const parent = findParent(get().page, id);
    if (!parent) return;
    const cloned = deepClone(node);
    const idx = parent.children?.findIndex(c => c.id === id) ?? 0;
    set(state => ({
      page: insertNode(state.page, parent.id, cloned, idx + 1),
      selectedId: cloned.id,
    }));
  },

  clearPage: () => set({ page: defaultPage, selectedId: null }),
  loadPage: (page) => set({ page, selectedId: null }),
}));