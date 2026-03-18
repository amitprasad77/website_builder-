// // src/components/layout/Builder.tsx
// import { useState } from 'react';
// import { useBuilderStore } from '../../store/builderStore';
// import { saveTemplate, updateTemplate } from '../../services/templateService';
// import ComponentPanel from './ComponentPanel';
// import Canvas from './Canvas';
// import PropertiesPanel from './PropertiesPanel';
// import Toolbar from '../common/Toolbar';
// import PreviewModal from '../common/PreviewModal';

// export default function Builder() {
//   const { page } = useBuilderStore();

//   const [templateName, setTemplateName] = useState('My Template');
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [savedTemplateId, setSavedTemplateId] = useState<string | null>(null);

//   // ─── Save Template ──────────────────────────────────────────────────────────
//   const handleSave = async () => {
//     if (!templateName.trim()) {
//       alert('Please enter a template name.');
//       return;
//     }

//     setSaving(true);

//     try {
//       const payload = {
//         name: templateName.trim(),
//         layout: page,
//       };

//       if (savedTemplateId) {
//         // Already saved → update
//         await updateTemplate(savedTemplateId, payload);
//       } else {
//         // First save → create
//         const data = await saveTemplate(payload);
//         setSavedTemplateId(data.id || null);
//       }

//       console.log('✓ Template saved');
//     } catch (error) {
//       console.error('Save failed:', error);
//       alert('Failed to save. Make sure the backend is running on http://localhost:5000');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ─── Export JSON ────────────────────────────────────────────────────────────
//   const handleExport = () => {
//     const json = JSON.stringify({ name: templateName, layout: page }, null, 2);
//     const blob = new Blob([json], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `${templateName.trim() || 'template'}.json`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   // ─── Render ─────────────────────────────────────────────────────────────────
//   return (
//     <div style={{
//       display: 'flex',
//       flexDirection: 'column',
//       height: '100vh',
//       overflow: 'hidden',
//       fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
//       background: '#0d0d1a',
//       color: '#dddddd',
//     }}>
//       {/* Top Toolbar */}
//       <Toolbar
//         templateName={templateName}
//         setTemplateName={setTemplateName}
//         onSave={handleSave}
//         onPreview={() => setPreviewOpen(true)}
//         onExport={handleExport}
//         saving={saving}
//         isSaved={!!savedTemplateId}
//       />

//       {/* Three Panel Layout */}
//       <div style={{
//         display: 'flex',
//         flex: 1,
//         overflow: 'hidden',
//       }}>
//         {/* Left: Component Panel */}
//         <ComponentPanel />

//         {/* Center: Canvas */}
//         <Canvas />

//         {/* Right: Properties Panel */}
//         <PropertiesPanel />
//       </div>

//       {/* Preview Modal */}
//       {previewOpen && (
//         <PreviewModal onClose={() => setPreviewOpen(false)} />
//       )}
//     </div>
//   );
// }


// src/components/layout/Builder.tsx
import { useState } from 'react';
import { useBuilderStore } from '../../store/builderStore';
import { saveTemplate, updateTemplate } from '../../services/templateService';
import type { Template } from '../../services/templateService';
import ComponentPanel from './ComponentPanel';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';
import Toolbar from '../common/Toolbar';
import PreviewModal from '../common/PreviewModal';
import TemplatesModal from '../common/TemplatesModal';

export default function Builder() {
  const { page, loadPage } = useBuilderStore();
  const [templateName, setTemplateName] = useState('My Template');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedTemplateId, setSavedTemplateId] = useState<string | null>(null);

  // ─── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!templateName.trim()) {
      alert('Please enter a template name.');
      return;
    }
    setSaving(true);
    try {
      const payload = { name: templateName.trim(), layout: page };
      if (savedTemplateId) {
        await updateTemplate(savedTemplateId, payload);
      } else {
        const data = await saveTemplate(payload);
        setSavedTemplateId(data.id);
      }
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save. Make sure the backend is running on http://localhost:5000');
    } finally {
      setSaving(false);
    }
  };

  // ─── Load ──────────────────────────────────────────────────────────────────
  const handleLoad = (template: Template) => {
    if (page.children && page.children.length > 0) {
      if (!confirm(`Load "${template.name}"? This will replace the current canvas.`)) return;
    }
    loadPage(template.layout);
    setTemplateName(template.name);
    setSavedTemplateId(template.id);
    setTemplatesOpen(false);
  };

  // ─── Export JSON ───────────────────────────────────────────────────────────
  const handleExport = () => {
    const json = JSON.stringify({ name: templateName, layout: page }, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${templateName.trim() || 'template'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', overflow: 'hidden',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      background: '#0d0d1a', color: '#dddddd',
    }}>
      <Toolbar
        templateName={templateName}
        setTemplateName={setTemplateName}
        onSave={handleSave}
        onPreview={() => setPreviewOpen(true)}
        onExport={handleExport}
        onOpenTemplates={() => setTemplatesOpen(true)}
        saving={saving}
        isSaved={!!savedTemplateId}
      />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <ComponentPanel />
        <Canvas />
        <PropertiesPanel />
      </div>

      {previewOpen && <PreviewModal onClose={() => setPreviewOpen(false)} />}

      {templatesOpen && (
        <TemplatesModal
          onClose={() => setTemplatesOpen(false)}
          onLoad={handleLoad}
        />
      )}
    </div>
  );
}