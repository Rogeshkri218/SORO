import { useRef, useState, type DragEvent, type KeyboardEvent } from 'react';
import {
  AlertCircle,
  Box,
  Check,
  ChevronLeft,
  ChevronRight,
  Cpu,
  FileText,
  Layers,
  Loader2,
  Trash2,
  Upload,
} from 'lucide-react';
import { sendWebsiteEnquiry } from '@/lib/enquiry';
import './PcbProjectForm.css';

type ProjectType = 'pcb-layout' | 'pcb-design' | 'mechanical-design';
type Step = 1 | 2 | 3;
type SubmitState = 'idle' | 'loading' | 'success' | 'error';

interface ProjectRequirements {
  software: string;
  softwareOther: string;
  description: string;
  quantity: string;
  deliverables: string[];
  constraints: string;
}

interface ContactDetails {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  deadline: string;
  contactMethod: string;
}

const MAX_DESCRIPTION_LENGTH = 10_000;
const MAX_TOTAL_FILE_BYTES = 500 * 1024 * 1024;
const ACCEPTED_EXTENSIONS = [
  '.pdf', '.png', '.jpg', '.jpeg', '.zip', '.7z', '.sch', '.kicad_sch',
  '.kicad_pcb', '.brd', '.pcbdoc', '.schdoc', '.step', '.stp', '.stl',
  '.iges', '.igs', '.dxf', '.dwg', '.csv', '.xlsx',
];

const projectTypes: {
  id: ProjectType;
  label: string;
  Icon: typeof Layers;
  placeholder: string;
}[] = [
  {
    id: 'pcb-layout',
    label: 'PCB Layout',
    Icon: Layers,
    placeholder: 'Describe your PCB shape and dimensions, number of layers, current or impedance requirements, component placement constraints, connector positions, and any existing design files.',
  },
  {
    id: 'pcb-design',
    label: 'PCB Design',
    Icon: Cpu,
    placeholder: 'Describe your circuit or product requirements, intended function, input/output voltages, components, interfaces, connectors, size constraints, operating environment, and expected deliverables.',
  },
  {
    id: 'mechanical-design',
    label: 'Mechanical Design',
    Icon: Box,
    placeholder: 'Describe the required dimensions, materials, tolerances, enclosure or mounting requirements, operating environment, manufacturing method, and preferred CAD deliverables.',
  },
];

const pcbSoftwareOptions = ['Altium Designer', 'KiCad', 'Cadence / OrCAD', 'Not sure yet'];
const cadSoftwareOptions = ['Not sure yet', 'AutoCAD', 'Fusion 360', 'SolidWorks', 'FreeCAD', 'Other'];
const deliverableOptions = [
  'Schematic source files',
  'PCB layout source files',
  'Gerber / fabrication outputs',
  'Bill of Materials (BOM)',
  'Assembly drawings',
  'CAD models or drawings',
];

const emptyRequirements = (): Record<ProjectType, ProjectRequirements> => ({
  'pcb-layout': { software: '', softwareOther: '', description: '', quantity: '', deliverables: [], constraints: '' },
  'pcb-design': { software: '', softwareOther: '', description: '', quantity: '', deliverables: [], constraints: '' },
  'mechanical-design': { software: '', softwareOther: '', description: '', quantity: '', deliverables: [], constraints: '' },
});

const emptyContact: ContactDetails = {
  fullName: '',
  companyName: '',
  email: '',
  phone: '',
  deadline: '',
  contactMethod: '',
};

const fileKey = (file: File) => `${file.name}-${file.size}-${file.lastModified}`;

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const FormError = ({ children, id }: { children?: string; id?: string }) =>
  children ? (
    <p className="pcb-form-error" id={id} role="alert">
      <AlertCircle aria-hidden="true" />
      {children}
    </p>
  ) : null;

const PcbProjectForm = () => {
  const [step, setStep] = useState<Step>(1);
  const [projectType, setProjectType] = useState<ProjectType>('pcb-layout');
  const [requirements, setRequirements] = useState(emptyRequirements);
  const [contact, setContact] = useState<ContactDetails>(emptyContact);
  const [files, setFiles] = useState<File[]>([]);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [submitError, setSubmitError] = useState('');
  const [website, setWebsite] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const currentRequirements = requirements[projectType];
  const activeProject = projectTypes.find((type) => type.id === projectType)!;
  const totalFileBytes = files.reduce((total, file) => total + file.size, 0);

  const updateRequirement = <K extends keyof ProjectRequirements>(key: K, value: ProjectRequirements[K]) => {
    setRequirements((previous) => ({
      ...previous,
      [projectType]: { ...previous[projectType], [key]: value },
    }));
    setErrors((previous) => ({ ...previous, [key]: '' }));
    setSubmitState('idle');
    setSubmitError('');
  };

  const updateContact = <K extends keyof ContactDetails>(key: K, value: ContactDetails[K]) => {
    setContact((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: '' }));
    setSubmitState('idle');
    setSubmitError('');
  };

  const selectProjectType = (nextType: ProjectType) => {
    setProjectType(nextType);
    setErrors({});
    setSubmitState('idle');
    setSubmitError('');
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | undefined;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % projectTypes.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + projectTypes.length) % projectTypes.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = projectTypes.length - 1;
    if (nextIndex === undefined) return;
    event.preventDefault();
    const nextType = projectTypes[nextIndex];
    if (!nextType) return;
    selectProjectType(nextType.id);
    tabRefs.current[nextIndex]?.focus();
  };

  const addFiles = (incoming: FileList | File[]) => {
    const candidates = Array.from(incoming);
    const messages: string[] = [];
    const accepted: File[] = [];
    let projectedBytes = totalFileBytes;
    const knownFileKeys = new Set(files.map(fileKey));

    for (const file of candidates) {
      const extension = `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`;
      if (!ACCEPTED_EXTENSIONS.includes(extension)) {
        messages.push(`${file.name}: unsupported file type.`);
        continue;
      }
      const key = fileKey(file);
      if (knownFileKeys.has(key)) continue;
      if (projectedBytes + file.size > MAX_TOTAL_FILE_BYTES) {
        messages.push(`${file.name}: adding this file would exceed the 500 MB total selection limit.`);
        continue;
      }
      accepted.push(file);
      knownFileKeys.add(key);
      projectedBytes += file.size;
    }

    if (accepted.length) setFiles((previous) => [...previous, ...accepted]);
    setFileErrors(messages);
  };

  const onFileDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    if (event.dataTransfer.files.length) addFiles(event.dataTransfer.files);
  };

  const validateProjectStep = () => {
    const nextErrors: Record<string, string> = {};
    if (!currentRequirements.description.trim()) {
      nextErrors.description = 'Please describe your project requirements.';
    } else if (currentRequirements.description.length > MAX_DESCRIPTION_LENGTH) {
      nextErrors.description = `Please keep the description within ${MAX_DESCRIPTION_LENGTH.toLocaleString()} characters.`;
    }
    if (projectType !== 'mechanical-design' && !currentRequirements.software) {
      nextErrors.software = 'Choose a PCB design software option or select “Not sure yet”.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const firstInvalid = Object.keys(nextErrors)[0];
      document.getElementById(`pcb-${firstInvalid}`)?.focus();
      return;
    }
    setSubmitState('idle');
    setSubmitError('');
    setStep(2);
  };

  const validateContactStep = () => {
    const nextErrors: Record<string, string> = {};
    if (contact.fullName.trim().length < 2) nextErrors.fullName = 'Enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }
    const normalizedPhone = contact.phone.replace(/[\s().-]/g, '');
    if (!/^\+?[1-9]\d{6,14}$/.test(normalizedPhone)) {
      nextErrors.phone = 'Enter a valid international phone number (7–15 digits).';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      document.getElementById(`pcb-contact-${Object.keys(nextErrors)[0]}`)?.focus();
      return;
    }
    setSubmitState('idle');
    setSubmitError('');
    setStep(3);
  };

  const submitProjectRequest = async () => {
    if (submitState === 'loading' || submitState === 'success') return;
    setSubmitState('loading');
    setSubmitError('');
    try {
      await sendWebsiteEnquiry('pcb-project', {
        projectType,
        ...currentRequirements,
        deadline: contact.deadline,
        contactMethod: contact.contactMethod,
        contact,
        selectedFiles: files.map(({ name, size }) => ({ name, size })),
        website,
      });
      setSubmitState('success');
    } catch (error) {
      setSubmitState('error');
      setSubmitError(error instanceof Error ? error.message : 'Your enquiry could not be delivered. Please retry.');
    }
  };

  const selectedSoftware = currentRequirements.software === 'Other'
    ? currentRequirements.softwareOther || 'Other (not specified)'
    : currentRequirements.software || 'Not selected';

  return (
    <section id="pcb-project-form" className="pcb-project-form-section">
      <div className="container-soro">
        <div className="pcb-project-form">
          <div className="pcb-form-heading">
            <p className="pcb-form-kicker">Project submission</p>
            <h2>Discuss Your PCB Project</h2>
            <p>Share the requirements you know. You can review everything before the next step.</p>
          </div>

          <p className="pcb-step-count" aria-live="polite">
            {step === 3 ? 'Final review' : `Step ${step} of 2`}
          </p>
          <div className="pcb-stepper" aria-label={`Step ${step === 3 ? 'Review' : `${step} of 2`}`}>
            {[1, 2, 3].map((stepNumber) => (
              <div className={`pcb-step ${step >= stepNumber ? 'is-active' : ''}`} key={stepNumber}>
                <span className="pcb-step-number">{step > stepNumber ? <Check aria-hidden="true" /> : stepNumber}</span>
                <span>{stepNumber === 1 ? 'Requirements' : stepNumber === 2 ? 'Contact details' : 'Review'}</span>
              </div>
            ))}
          </div>

          {step === 1 && (
            <div>
              <div className="pcb-project-tabs" role="tablist" aria-label="Project type">
                {projectTypes.map(({ id, label, Icon }, index) => (
                  <button
                    aria-controls="pcb-project-tab-panel"
                    aria-selected={projectType === id}
                    className={`pcb-project-tab ${projectType === id ? 'is-selected' : ''}`}
                    id={`pcb-project-tab-${id}`}
                    key={id}
                    onClick={() => selectProjectType(id)}
                    onKeyDown={(event) => onTabKeyDown(event, index)}
                    ref={(element) => { tabRefs.current[index] = element; }}
                    role="tab"
                    tabIndex={projectType === id ? 0 : -1}
                    type="button"
                  >
                    <Icon aria-hidden="true" />
                    {label}
                  </button>
                ))}
              </div>

              <div aria-labelledby={`pcb-project-tab-${projectType}`} id="pcb-project-tab-panel" role="tabpanel">
                <div className="pcb-form-grid">
                  <div className="pcb-field">
                    <label htmlFor="pcb-software">
                      {projectType === 'mechanical-design' ? 'Preferred CAD Software' : 'Preferred PCB Design Software'}
                      {projectType !== 'mechanical-design' && <span className="pcb-required">Required</span>}
                    </label>
                    <select
                      aria-describedby={errors.software ? 'pcb-software-error' : undefined}
                      aria-invalid={Boolean(errors.software)}
                      className="pcb-input"
                      id="pcb-software"
                      onChange={(event) => updateRequirement('software', event.target.value)}
                      value={currentRequirements.software}
                    >
                      <option value="">Select an option</option>
                      {(projectType === 'mechanical-design' ? cadSoftwareOptions : pcbSoftwareOptions).map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    {currentRequirements.software === 'Other' && (
                      <input
                        aria-label="Other CAD software"
                        className="pcb-input pcb-input-extra"
                        onChange={(event) => updateRequirement('softwareOther', event.target.value)}
                        placeholder="Enter CAD software (optional)"
                        value={currentRequirements.softwareOther}
                      />
                    )}
                    <FormError id="pcb-software-error">{errors.software}</FormError>
                  </div>

                  <div className="pcb-field">
                    <label htmlFor="pcb-quantity">Expected Quantity <span className="pcb-optional">Optional</span></label>
                    <input
                      className="pcb-input"
                      id="pcb-quantity"
                      onChange={(event) => updateRequirement('quantity', event.target.value)}
                      placeholder="e.g. 5 prototypes or 100 units"
                      value={currentRequirements.quantity}
                    />
                  </div>
                </div>

                <div className="pcb-field pcb-description-field">
                  <label htmlFor="pcb-description">Project Details <span className="pcb-required">Required</span></label>
                  <textarea
                    aria-describedby={errors.description ? 'pcb-description-error pcb-description-count' : 'pcb-description-count'}
                    aria-invalid={Boolean(errors.description)}
                    className="pcb-input pcb-textarea"
                    id="pcb-description"
                    maxLength={MAX_DESCRIPTION_LENGTH}
                    onChange={(event) => updateRequirement('description', event.target.value)}
                    placeholder={activeProject.placeholder}
                    value={currentRequirements.description}
                  />
                  <div className="pcb-field-meta">
                    <FormError id="pcb-description-error">{errors.description}</FormError>
                    <span id="pcb-description-count" aria-live="polite">
                      {currentRequirements.description.length}/{MAX_DESCRIPTION_LENGTH}
                    </span>
                  </div>
                </div>

                <fieldset className="pcb-field pcb-deliverables">
                  <legend>Preferred Deliverables <span className="pcb-optional">Optional</span></legend>
                  <div className="pcb-checkbox-grid">
                    {deliverableOptions.map((deliverable) => (
                      <label className="pcb-checkbox-label" key={deliverable}>
                        <input
                          checked={currentRequirements.deliverables.includes(deliverable)}
                          onChange={(event) => {
                            const nextValues = event.target.checked
                              ? [...currentRequirements.deliverables, deliverable]
                              : currentRequirements.deliverables.filter((value) => value !== deliverable);
                            updateRequirement('deliverables', nextValues);
                          }}
                          type="checkbox"
                        />
                        <span>{deliverable}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="pcb-field">
                  <label htmlFor="pcb-constraints">Additional Technical Constraints <span className="pcb-optional">Optional</span></label>
                  <textarea
                    className="pcb-input pcb-textarea pcb-textarea-short"
                    id="pcb-constraints"
                    onChange={(event) => updateRequirement('constraints', event.target.value)}
                    placeholder="Operating conditions, standards to consider, or other constraints"
                    value={currentRequirements.constraints}
                  />
                </div>

                <div className="pcb-field pcb-upload-field">
                  <div className="pcb-upload-label">
                    <span>Project Files <span className="pcb-optional">Optional</span></span>
                    <span className="pcb-upload-limit">{formatFileSize(MAX_TOTAL_FILE_BYTES)} maximum total</span>
                  </div>
                  <input
                    accept={ACCEPTED_EXTENSIONS.join(',')}
                    className="pcb-file-input"
                    multiple
                    onChange={(event) => {
                      if (event.target.files) addFiles(event.target.files);
                      event.target.value = '';
                    }}
                    ref={inputRef}
                    type="file"
                  />
                  <div
                    className={`pcb-dropzone ${dragging ? 'is-dragging' : ''}`}
                    onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
                    onDragLeave={(event) => {
                      const relatedTarget = event.relatedTarget;
                      if (!(relatedTarget instanceof Node) || !event.currentTarget.contains(relatedTarget)) {
                        setDragging(false);
                      }
                    }}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={onFileDrop}
                  >
                    <Upload aria-hidden="true" />
                    <button className="pcb-upload-button" onClick={() => inputRef.current?.click()} type="button">
                      Click to Upload Files (Up to 500MB)
                    </button>
                    <p>or drag and drop files here</p>
                    <span>Design files, schematics, PCB layouts, CAD models, drawings, BOMs, or reference documents.</span>
                  </div>
                  <FormError id="pcb-files-error">{fileErrors.join(' ')}</FormError>
                  <p className="pcb-file-disclosure">
                    Accepted: {ACCEPTED_EXTENSIONS.join(', ')}. Proprietary formats may require compatible receiving software.
                    Selections remain in this browser; files are not uploaded. Do not select confidential or sensitive designs.
                  </p>
                  {files.length > 0 && (
                    <ul className="pcb-file-list" aria-label="Selected files">
                      {files.map((file) => (
                        <li key={fileKey(file)}>
                          <FileText aria-hidden="true" />
                          <span className="pcb-file-name">{file.name}</span>
                          <span className="pcb-file-size">{formatFileSize(file.size)}</span>
                          <button
                            aria-label={`Remove ${file.name}`}
                            className="pcb-remove-file"
                            onClick={() => setFiles((previous) => previous.filter((item) => fileKey(item) !== fileKey(file)))}
                            type="button"
                          >
                            <Trash2 aria-hidden="true" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="pcb-form-actions">
                <span className="pcb-action-note">Step 1 of 2 · Required fields are marked</span>
                <button className="pcb-button pcb-button-primary" onClick={validateProjectStep} type="button">
                  Next Step <ChevronRight aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="pcb-contact-step">
              <div className="pcb-form-grid">
                <div className="pcb-field">
                  <label htmlFor="pcb-contact-fullName">Full Name <span className="pcb-required">Required</span></label>
                  <input
                    aria-describedby={errors.fullName ? 'pcb-fullName-error' : undefined}
                    aria-invalid={Boolean(errors.fullName)}
                    className="pcb-input"
                    id="pcb-contact-fullName"
                    onChange={(event) => updateContact('fullName', event.target.value)}
                    autoComplete="name"
                    value={contact.fullName}
                  />
                  <FormError id="pcb-fullName-error">{errors.fullName}</FormError>
                </div>
                <div className="pcb-field">
                  <label htmlFor="pcb-contact-companyName">Company Name <span className="pcb-optional">Optional</span></label>
                  <input
                    autoComplete="organization"
                    className="pcb-input"
                    id="pcb-contact-companyName"
                    onChange={(event) => updateContact('companyName', event.target.value)}
                    value={contact.companyName}
                  />
                </div>
                <div className="pcb-field">
                  <label htmlFor="pcb-contact-email">Email Address <span className="pcb-required">Required</span></label>
                  <input
                    aria-describedby={errors.email ? 'pcb-email-error' : undefined}
                    aria-invalid={Boolean(errors.email)}
                    autoComplete="email"
                    className="pcb-input"
                    id="pcb-contact-email"
                    onChange={(event) => updateContact('email', event.target.value)}
                    type="email"
                    value={contact.email}
                  />
                  <FormError id="pcb-email-error">{errors.email}</FormError>
                </div>
                <div className="pcb-field">
                  <label htmlFor="pcb-contact-phone">Phone Number <span className="pcb-required">Required</span></label>
                  <input
                    aria-describedby={errors.phone ? 'pcb-phone-error' : undefined}
                    aria-invalid={Boolean(errors.phone)}
                    autoComplete="tel"
                    className="pcb-input"
                    id="pcb-contact-phone"
                    onChange={(event) => updateContact('phone', event.target.value)}
                    placeholder="+91 98765 43210"
                    type="tel"
                    value={contact.phone}
                  />
                  <FormError id="pcb-phone-error">{errors.phone}</FormError>
                </div>
                <div className="pcb-field">
                  <label htmlFor="pcb-contact-deadline">Project Deadline <span className="pcb-optional">Optional</span></label>
                  <input
                    className="pcb-input"
                    id="pcb-contact-deadline"
                    onChange={(event) => updateContact('deadline', event.target.value)}
                    type="date"
                    value={contact.deadline}
                  />
                </div>
                <div className="pcb-field">
                  <label htmlFor="pcb-contact-method">Preferred Contact Method <span className="pcb-optional">Optional</span></label>
                  <select
                    className="pcb-input"
                    id="pcb-contact-method"
                    onChange={(event) => updateContact('contactMethod', event.target.value)}
                    value={contact.contactMethod}
                  >
                    <option value="">No preference</option>
                    <option value="Email">Email</option>
                    <option value="Phone call">Phone call</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="pcb-form-actions">
                <button className="pcb-button pcb-button-secondary" onClick={() => { setErrors({}); setStep(1); }} type="button">
                  <ChevronLeft aria-hidden="true" /> Back
                </button>
                <button className="pcb-button pcb-button-primary" onClick={validateContactStep} type="button">
                  Continue to Review <ChevronRight aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="pcb-review">
              <h3>Review your project request</h3>
              <p className="pcb-review-intro">Check your details. Nothing will be sent or uploaded from this page.</p>
              <section className="pcb-review-group">
                <h4>Project requirements</h4>
                <dl>
                  <div><dt>Project type</dt><dd>{activeProject.label}</dd></div>
                  <div>
                    <dt>{projectType === 'mechanical-design' ? 'Preferred CAD software' : 'Preferred PCB design software'}</dt>
                    <dd>{selectedSoftware}</dd>
                  </div>
                  <div><dt>Project details</dt><dd className="pcb-review-prewrap">{currentRequirements.description}</dd></div>
                  <div><dt>Expected quantity</dt><dd>{currentRequirements.quantity || 'Not specified'}</dd></div>
                  <div><dt>Preferred deliverables</dt><dd>{currentRequirements.deliverables.join(', ') || 'Not specified'}</dd></div>
                  <div><dt>Additional constraints</dt><dd className="pcb-review-prewrap">{currentRequirements.constraints || 'Not specified'}</dd></div>
                  <div><dt>Selected file names and sizes</dt><dd>{files.length ? files.map((file) => `${file.name} (${formatFileSize(file.size)})`).join('; ') : 'No files selected'}</dd></div>
                </dl>
              </section>
              <section className="pcb-review-group">
                <h4>Contact details</h4>
                <dl>
                  <div><dt>Full name</dt><dd>{contact.fullName}</dd></div>
                  <div><dt>Company</dt><dd>{contact.companyName || 'Not specified'}</dd></div>
                  <div><dt>Email</dt><dd>{contact.email}</dd></div>
                  <div><dt>Phone</dt><dd>{contact.phone}</dd></div>
                  <div><dt>Project deadline</dt><dd>{contact.deadline || 'Not specified'}</dd></div>
                  <div><dt>Preferred contact</dt><dd>{contact.contactMethod || 'No preference'}</dd></div>
                </dl>
              </section>
              <div className="pcb-upload-pending" role="note">
                <AlertCircle aria-hidden="true" />
                <p>
                  <strong>Files are not uploaded or attached.</strong> The enquiry email includes selected file names and sizes only.
                  Do not select confidential designs; agree a secure transfer method with SORO before sharing sensitive files.
                </p>
              </div>
              <div aria-hidden="true" className="pcb-honeypot">
                <label htmlFor="pcb-website">Leave this field blank</label>
                <input
                  autoComplete="off"
                  id="pcb-website"
                  onChange={(event) => setWebsite(event.target.value)}
                  tabIndex={-1}
                  value={website}
                />
              </div>
              {submitState === 'success' && (
                <p className="pcb-submit-success" role="status">
                  Your enquiry was accepted by the email service for delivery to orders@sorofabrication.in.
                  Selected files were not uploaded or attached.
                </p>
              )}
              {submitState === 'error' && (
                <p className="pcb-submit-notice" role="alert">
                  {submitError} Selected information is still available here so you can retry.
                </p>
              )}
              <div className="pcb-form-actions">
                <button
                  className="pcb-button pcb-button-secondary"
                  disabled={submitState === 'loading'}
                  onClick={() => { setSubmitState('idle'); setSubmitError(''); setStep(2); }}
                  type="button"
                >
                  <ChevronLeft aria-hidden="true" /> Back to Edit
                </button>
                <button
                  className="pcb-button pcb-button-primary"
                  disabled={submitState === 'loading' || submitState === 'success'}
                  onClick={() => { void submitProjectRequest(); }}
                  type="button"
                >
                  {submitState === 'loading' ? (
                    <>
                      <Loader2 aria-hidden="true" className="pcb-spinner" /> Sending…
                    </>
                  ) : submitState === 'success' ? (
                    <>
                      <Check aria-hidden="true" /> Request Sent
                    </>
                  ) : (
                    <>
                      Submit Project Request <ChevronRight aria-hidden="true" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PcbProjectForm;
