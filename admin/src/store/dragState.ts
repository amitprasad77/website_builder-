// src/store/dragState.ts
// Global drag state — works in ALL browsers including Brave

export const dragState = {
  // What is being dragged
  active: false,
  source: null as 'palette' | 'canvas' | null,
  componentType: null as string | null,
  nodeId: null as string | null,
  label: null as string | null,

  // Ghost element
  ghost: null as HTMLElement | null,

  startPaletteDrag(componentType: string, label: string) {
    this.active = true;
    this.source = 'palette';
    this.componentType = componentType;
    this.label = label;
    this.nodeId = null;
    this.createGhost(`+ ${label}`);
  },

  startCanvasDrag(nodeId: string, label: string) {
    this.active = true;
    this.source = 'canvas';
    this.nodeId = nodeId;
    this.label = label;
    this.componentType = null;
    this.createGhost(`↔ ${label}`);
  },

  createGhost(text: string) {
    const el = document.createElement('div');
    el.id = 'drag-ghost';
    el.textContent = text;
    el.style.cssText = `
      position: fixed;
      top: -999px;
      left: -999px;
      padding: 8px 16px;
      background: #6c63ff;
      color: #fff;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      font-family: Inter, sans-serif;
      pointer-events: none;
      z-index: 99999;
      box-shadow: 0 8px 24px rgba(108,99,255,0.5);
      white-space: nowrap;
      user-select: none;
    `;
    document.body.appendChild(el);
    this.ghost = el;
  },

  moveGhost(x: number, y: number) {
    if (this.ghost) {
      this.ghost.style.left = `${x + 12}px`;
      this.ghost.style.top = `${y + 12}px`;
    }
  },

  removeGhost() {
    if (this.ghost) {
      document.body.removeChild(this.ghost);
      this.ghost = null;
    }
  },

  clear() {
    this.active = false;
    this.source = null;
    this.componentType = null;
    this.nodeId = null;
    this.label = null;
    this.removeGhost();
  },
};