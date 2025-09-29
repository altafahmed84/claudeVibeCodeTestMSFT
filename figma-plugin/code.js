// Timeline Tool Design Generator - Figma Plugin
// Generates complete timeline tool designs based on PowerPoint slide

// Design system colors and styles
const COLORS = {
  primary: {
    background: { r: 0.1, g: 0.137, b: 0.196 }, // #1a2332
    backgroundSecondary: { r: 0.141, g: 0.204, b: 0.278 }, // #243447
    surface: { r: 0.176, g: 0.263, b: 0.337 }, // #2d4356
    surfaceElevated: { r: 0.212, g: 0.29, b: 0.373 } // #364a5f
  },
  timeline: {
    gradientStart: { r: 0.306, g: 0.804, b: 0.769, a: 1 }, // #4ecdc4
    gradientMid: { r: 0.267, g: 0.627, b: 0.553, a: 1 }, // #44a08d
    gradientEnd: { r: 0.420, g: 0.451, b: 1.0, a: 1 }, // #6b73ff
    milestoneActive: { r: 0.306, g: 0.804, b: 0.769, a: 1 }, // #4ecdc4
    milestoneInactive: { r: 0.420, g: 0.451, b: 0.502, a: 1 }, // #6b7280
    connectionLine: { r: 0.216, g: 0.255, b: 0.318, a: 1 } // #374151
  },
  text: {
    primary: { r: 1, g: 1, b: 1 }, // #ffffff
    secondary: { r: 0.820, g: 0.835, b: 0.859 }, // #d1d5db
    muted: { r: 0.612, g: 0.639, b: 0.686 }, // #9ca3af
    accent: { r: 0.306, g: 0.804, b: 0.769 } // #4ecdc4
  }
};

// Features from the actual PowerPoint slide
const MILESTONES = [
  {
    id: 1,
    title: "GPT-5",
    date: "August 7th",
    icon: "🌀", // Spiral icon from slide
    status: "General availability",
    description: "Advanced language model capabilities"
  },
  {
    id: 2,
    title: "Copilot function =Copilot()",
    date: "August 18th",
    icon: "📊", // Excel green icon
    status: "Released",
    description: "Excel integration for AI-powered functions"
  },
  {
    id: 3,
    title: "Human-agent collab in Teams",
    date: "September 18th",
    icon: "👥", // Teams icon representation
    status: "Released",
    description: "Collaborative AI agent features in Microsoft Teams"
  },
  {
    id: 4,
    title: "Copilot Studio Value in M365 Copilot",
    date: "September 1st",
    icon: "🏗️", // Studio/building icon
    status: "Released",
    description: "Enhanced value delivery through Copilot Studio integration"
  },
  {
    id: 5,
    title: "Copilot Chat in M365 Apps",
    date: "September 15th",
    icon: "💬", // Chat/apps icon
    status: "Released",
    description: "Integrated chat across Word, Excel, PowerPoint, Outlook, OneNote"
  },
  {
    id: 6,
    title: "Role-based AI Solutions in M365 Copilot",
    date: "October 10th",
    icon: "🎯", // M365 colorful icon representation
    status: "Released",
    description: "Specialized AI solutions tailored for different organizational roles"
  }
];

// Web-like component creation functions
async function createNavigationHeader() {
  await figma.loadFontAsync({ family: "Roboto", style: "Regular" });

  const header = figma.createFrame();
  header.name = "Navigation Header";
  header.resize(1920, 80);
  header.fills = [{ type: "SOLID", color: COLORS.primary.backgroundSecondary }];
  header.effects = [{
    type: "DROP_SHADOW",
    color: { r: 0, g: 0, b: 0, a: 0.1 },
    offset: { x: 0, y: 2 },
    radius: 8,
    visible: true,
    blendMode: "NORMAL"
  }];

  // Logo/Brand
  const logo = figma.createText();
  logo.fontName = { family: "Roboto", style: "Regular" };
  logo.characters = "🚀 AI Timeline";
  logo.fontSize = 24;
  logo.fills = [{ type: "SOLID", color: COLORS.text.primary }];
  logo.x = 32;
  logo.y = 28;
  header.appendChild(logo);

  // Navigation menu
  const navItems = ["Overview", "Features", "Timeline"];
  for (let i = 0; i < navItems.length; i++) {
    const navItem = figma.createText();
    navItem.fontName = { family: "Roboto", style: "Regular" };
    navItem.characters = navItems[i];
    navItem.fontSize = 16;
    navItem.fills = [{ type: "SOLID", color: COLORS.text.secondary }];
    navItem.x = 300 + (i * 120);
    navItem.y = 32;
    header.appendChild(navItem);
  }

  return header;
}

async function createFeatureGrid() {
  const gridContainer = figma.createFrame();
  gridContainer.name = "Feature Grid";
  gridContainer.x = 32;
  gridContainer.y = 32;
  gridContainer.resize(1200, 936);
  gridContainer.fills = [];

  // Grid header
  const gridHeader = figma.createFrame();
  gridHeader.name = "Grid Header";
  gridHeader.resize(1200, 100);
  gridHeader.fills = [];

  const gridTitle = figma.createText();
  gridTitle.fontName = { family: "Roboto", style: "Regular" };
  gridTitle.characters = "🚀 Microsoft Copilot Evolution";
  gridTitle.fontSize = 32;
  gridTitle.fills = [{ type: "SOLID", color: COLORS.text.primary }];
  gridTitle.x = 0;
  gridTitle.y = 20;
  gridHeader.appendChild(gridTitle);

  // Add feature button
  const addBtn = figma.createFrame();
  addBtn.name = "Add Feature Button";
  addBtn.x = 700;
  addBtn.y = 20;
  addBtn.resize(180, 48);
  addBtn.fills = [{
    type: "GRADIENT_LINEAR",
    gradientTransform: [[1, 0, 0], [0, 1, 0]],
    gradientStops: [
      { color: { r: 0.306, g: 0.804, b: 0.769, a: 1 }, position: 0 },
      { color: { r: 0.420, g: 0.451, b: 1.0, a: 1 }, position: 1 }
    ]
  }];
  addBtn.cornerRadius = 24;
  addBtn.effects = [{
    type: "DROP_SHADOW",
    color: { r: 0.306, g: 0.804, b: 0.769, a: 0.3 },
    offset: { x: 0, y: 4 },
    radius: 12,
    visible: true,
    blendMode: "NORMAL"
  }];

  const addBtnText = figma.createText();
  addBtnText.fontName = { family: "Roboto", style: "Regular" };
  addBtnText.characters = "+ Add Feature";
  addBtnText.fontSize = 16;
  addBtnText.fills = [{ type: "SOLID", color: COLORS.text.primary }];
  addBtnText.textAlignHorizontal = "CENTER";
  addBtnText.textAlignVertical = "CENTER";
  addBtnText.x = 0;
  addBtnText.y = 0;
  addBtnText.resize(180, 48);
  addBtn.appendChild(addBtnText);
  gridHeader.appendChild(addBtn);

  // Timeline overview button
  const timelineBtn = figma.createFrame();
  timelineBtn.name = "Timeline Overview Button";
  timelineBtn.x = 950;
  timelineBtn.y = 20;
  timelineBtn.resize(250, 48);
  timelineBtn.fills = [{ type: "SOLID", color: COLORS.primary.surfaceElevated }];
  timelineBtn.cornerRadius = 24;
  timelineBtn.effects = [{
    type: "DROP_SHADOW",
    color: { r: 0.306, g: 0.804, b: 0.769, a: 0.3 },
    offset: { x: 0, y: 4 },
    radius: 12,
    visible: true,
    blendMode: "NORMAL"
  }];

  const timelineBtnText = figma.createText();
  timelineBtnText.fontName = { family: "Roboto", style: "Regular" };
  timelineBtnText.characters = "📈 Timeline Overview";
  timelineBtnText.fontSize = 16;
  timelineBtnText.fills = [{ type: "SOLID", color: COLORS.text.accent }];
  timelineBtnText.textAlignHorizontal = "CENTER";
  timelineBtnText.textAlignVertical = "CENTER";
  timelineBtnText.x = 0;
  timelineBtnText.y = 0;
  timelineBtnText.resize(250, 48);
  timelineBtn.appendChild(timelineBtnText);
  gridHeader.appendChild(timelineBtn);

  gridContainer.appendChild(gridHeader);

  // Create feature grid (3x2 layout for 6 features)
  const cols = 3;
  const rows = 2;
  const cardWidth = 360;
  const cardHeight = 200;
  const spacing = 40;

  for (let i = 0; i < MILESTONES.length; i++) {
    const milestone = MILESTONES[i];
    const col = i % cols;
    const row = Math.floor(i / cols);

    const featureCard = await createFeatureCard(milestone, i);
    featureCard.x = col * (cardWidth + spacing);
    featureCard.y = 120 + (row * (cardHeight + spacing));
    gridContainer.appendChild(featureCard);
  }

  return gridContainer;
}

async function createFeatureCard(milestone, index) {
  const card = figma.createFrame();
  card.name = `Feature Card ${milestone.id}`;
  card.resize(360, 200);
  card.fills = [{ type: "SOLID", color: COLORS.primary.surface }];
  card.cornerRadius = 16;
  card.effects = [{
    type: "DROP_SHADOW",
    color: { r: 0, g: 0, b: 0, a: 0.2 },
    offset: { x: 0, y: 8 },
    radius: 24,
    visible: true,
    blendMode: "NORMAL"
  }];

  // Feature icon (large)
  const icon = figma.createText();
  icon.fontName = { family: "Roboto", style: "Regular" };
  icon.characters = milestone.icon;
  icon.fontSize = 48;
  icon.fills = [{ type: "SOLID", color: { r: 0.306, g: 0.804, b: 0.769 } }];
  icon.x = 32;
  icon.y = 32;
  card.appendChild(icon);

  // Feature title (with better wrapping)
  const title = figma.createText();
  title.fontName = { family: "Roboto", style: "Regular" };
  title.characters = milestone.title;
  title.fontSize = 18; // Smaller to prevent overlap
  title.fills = [{ type: "SOLID", color: COLORS.text.primary }];
  title.x = 32;
  title.y = 100;
  title.resize(200, 50); // More height for wrapping
  card.appendChild(title);

  // Status badge (repositioned)
  const statusBadge = figma.createFrame();
  statusBadge.name = "Status Badge";
  statusBadge.x = 250;
  statusBadge.y = 32;
  statusBadge.resize(78, 20);
  statusBadge.fills = [{ type: "SOLID", color: COLORS.primary.backgroundSecondary }];
  statusBadge.cornerRadius = 10;

  const statusText = figma.createText();
  statusText.fontName = { family: "Roboto", style: "Regular" };
  statusText.characters = milestone.status;
  statusText.fontSize = 10;
  statusText.fills = [{ type: "SOLID", color: COLORS.text.accent }];
  statusText.textAlignHorizontal = "CENTER";
  statusText.textAlignVertical = "CENTER";
  statusText.x = 0;
  statusText.y = 0;
  statusText.resize(78, 20);
  statusBadge.appendChild(statusText);
  card.appendChild(statusBadge);

  // Feature description (positioned lower)
  const desc = figma.createText();
  desc.fontName = { family: "Roboto", style: "Regular" };
  desc.characters = milestone.description;
  desc.fontSize = 12; // Smaller text
  desc.fills = [{ type: "SOLID", color: COLORS.text.secondary }];
  desc.x = 32;
  desc.y = 155; // Lower position
  desc.resize(296, 30); // Less height
  card.appendChild(desc);

  return card;
}

async function createTimelineItem(milestone, index) {
  const item = figma.createFrame();
  item.name = `Timeline Item ${milestone.id}`;
  item.x = 16;
  item.resize(368, 100);
  item.fills = [{ type: "SOLID", color: COLORS.primary.surfaceElevated }];
  item.cornerRadius = 12;

  // Make it look interactive/clickable
  item.effects = [{
    type: "DROP_SHADOW",
    color: { r: 0.306, g: 0.804, b: 0.769, a: 0.2 },
    offset: { x: 0, y: 2 },
    radius: 8,
    visible: true,
    blendMode: "NORMAL"
  }];

  // Status dot
  const statusDot = figma.createEllipse();
  statusDot.resize(12, 12);
  statusDot.x = 16;
  statusDot.y = 16;
  statusDot.fills = [{ type: "SOLID", color: { r: 0.306, g: 0.804, b: 0.769 } }];
  item.appendChild(statusDot);

  // Title
  const title = figma.createText();
  title.fontName = { family: "Roboto", style: "Regular" };
  title.characters = milestone.title;
  title.fontSize = 16;
  title.fills = [{ type: "SOLID", color: COLORS.text.primary }];
  title.x = 40;
  title.y = 16;
  item.appendChild(title);

  // Date
  const date = figma.createText();
  date.fontName = { family: "Roboto", style: "Regular" };
  date.characters = milestone.date;
  date.fontSize = 14;
  date.fills = [{ type: "SOLID", color: COLORS.text.secondary }];
  date.x = 40;
  date.y = 40;
  item.appendChild(date);

  // Description
  const desc = figma.createText();
  desc.fontName = { family: "Roboto", style: "Regular" };
  desc.characters = milestone.description || "Click to view details";
  desc.fontSize = 12;
  desc.fills = [{ type: "SOLID", color: COLORS.text.muted }];
  desc.x = 40;
  desc.y = 64;
  desc.resize(300, 20);
  item.appendChild(desc);

  return item;
}

async function createRightSideDetailsPanel() {
  const panel = figma.createFrame();
  panel.name = "Feature Details Panel";
  panel.x = 1264;
  panel.y = 32;
  panel.resize(600, 936);
  panel.fills = [{ type: "SOLID", color: COLORS.primary.surface }];
  panel.cornerRadius = 16;
  panel.effects = [{
    type: "DROP_SHADOW",
    color: { r: 0, g: 0, b: 0, a: 0.2 },
    offset: { x: 0, y: 8 },
    radius: 24,
    visible: true,
    blendMode: "NORMAL"
  }];

  // Panel header
  const panelTitle = figma.createText();
  panelTitle.fontName = { family: "Roboto", style: "Regular" };
  panelTitle.characters = "Feature Details";
  panelTitle.fontSize = 28;
  panelTitle.fills = [{ type: "SOLID", color: COLORS.text.primary }];
  panelTitle.x = 32;
  panelTitle.y = 32;
  panel.appendChild(panelTitle);

  // Selected feature display
  const selectedFeature = figma.createText();
  selectedFeature.fontName = { family: "Roboto", style: "Regular" };
  selectedFeature.characters = "👆 Click a feature card to view detailed information, usage examples, and configuration options.";
  selectedFeature.fontSize = 16;
  selectedFeature.fills = [{ type: "SOLID", color: COLORS.text.secondary }];
  selectedFeature.x = 32;
  selectedFeature.y = 100;
  selectedFeature.resize(536, 300);
  panel.appendChild(selectedFeature);

  // Placeholder for feature content
  const featureContent = figma.createFrame();
  featureContent.name = "Feature Content Area";
  featureContent.x = 32;
  featureContent.y = 420;
  featureContent.resize(536, 480);
  featureContent.fills = [{ type: "SOLID", color: COLORS.primary.backgroundSecondary }];
  featureContent.cornerRadius = 12;
  panel.appendChild(featureContent);

  const contentPlaceholder = figma.createText();
  contentPlaceholder.fontName = { family: "Roboto", style: "Regular" };
  contentPlaceholder.characters = "Feature documentation, code examples, and interactive demos will appear here when you select a feature.";
  contentPlaceholder.fontSize = 14;
  contentPlaceholder.fills = [{ type: "SOLID", color: COLORS.text.muted }];
  contentPlaceholder.x = 24;
  contentPlaceholder.y = 24;
  contentPlaceholder.resize(488, 100);
  featureContent.appendChild(contentPlaceholder);

  return panel;
}

async function createAddFeatureButton() {
  const button = figma.createFrame();
  button.name = "Add Feature Button";
  button.x = 464;
  button.y = 664;
  button.resize(200, 48);
  button.fills = [{
    type: "GRADIENT_LINEAR",
    gradientTransform: [[1, 0, 0], [0, 1, 0]],
    gradientStops: [
      { color: COLORS.timeline.gradientStart, position: 0 },
      { color: COLORS.timeline.gradientEnd, position: 1 }
    ]
  }];
  button.cornerRadius = 24;
  button.effects = [{
    type: "DROP_SHADOW",
    color: { r: 0.306, g: 0.804, b: 0.769, a: 0.3 },
    offset: { x: 0, y: 4 },
    radius: 12,
    visible: true,
    blendMode: "NORMAL"
  }];

  const buttonText = figma.createText();
  buttonText.fontName = { family: "Roboto", style: "Regular" };
  buttonText.characters = "+ Add Feature";
  buttonText.fontSize = 16;
  buttonText.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  buttonText.textAlignHorizontal = "CENTER";
  buttonText.textAlignVertical = "CENTER";
  buttonText.x = 0;
  buttonText.y = 0;
  buttonText.resize(200, 48);
  button.appendChild(buttonText);

  return button;
}

async function createHorizontalTimeline() {
  const timelineFrame = figma.createFrame();
  timelineFrame.name = "Interactive Timeline";
  timelineFrame.x = 464;
  timelineFrame.y = 664;
  timelineFrame.resize(1200, 300);
  timelineFrame.fills = [{ type: "SOLID", color: COLORS.primary.surface }];
  timelineFrame.cornerRadius = 16;
  timelineFrame.effects = [{
    type: "DROP_SHADOW",
    color: { r: 0, g: 0, b: 0, a: 0.2 },
    offset: { x: 0, y: 8 },
    radius: 24,
    visible: true,
    blendMode: "NORMAL"
  }];

  // Timeline header
  const timelineTitle = figma.createText();
  timelineTitle.fontName = { family: "Roboto", style: "Regular" };
  timelineTitle.characters = "Interactive Timeline";
  timelineTitle.fontSize = 18;
  timelineTitle.fills = [{ type: "SOLID", color: COLORS.text.primary }];
  timelineTitle.x = 24;
  timelineTitle.y = 24;
  timelineFrame.appendChild(timelineTitle);

  // Create timeline line
  const timelineLine = figma.createLine();
  timelineLine.name = "Timeline Line";
  timelineLine.x = 80;
  timelineLine.y = 150;
  timelineLine.resize(1040, 0);
  timelineLine.strokes = [{ type: "SOLID", color: { r: 0.216, g: 0.255, b: 0.318 } }];
  timelineLine.strokeWeight = 3;
  timelineFrame.appendChild(timelineLine);

  // Create milestone points
  const milestoneSpacing = 200;
  for (let i = 0; i < MILESTONES.length; i++) {
    const milestone = MILESTONES[i];
    const x = 80 + (i * milestoneSpacing);

    // Create milestone circle
    const circle = figma.createEllipse();
    circle.name = `Milestone ${milestone.id}`;
    circle.resize(32, 32);
    circle.x = x - 16;
    circle.y = 134;
    circle.fills = [{
      type: "GRADIENT_LINEAR",
      gradientTransform: [[1, 0, 0], [0, 1, 0]],
      gradientStops: [
        { color: { r: 0.306, g: 0.804, b: 0.769 }, position: 0 },
        { color: { r: 0.267, g: 0.627, b: 0.553 }, position: 1 }
      ]
    }];
    circle.strokes = [{ type: "SOLID", color: COLORS.text.primary }];
    circle.strokeWeight = 2;
    circle.effects = [{
      type: "DROP_SHADOW",
      color: { r: 0.306, g: 0.804, b: 0.769, a: 0.4 },
      offset: { x: 0, y: 4 },
      radius: 12,
      visible: true,
      blendMode: "NORMAL"
    }];
    timelineFrame.appendChild(circle);

    // Add milestone icon
    const icon = figma.createText();
    icon.fontName = { family: "Roboto", style: "Regular" };
    icon.characters = milestone.icon;
    icon.fontSize = 16;
    icon.fills = [{ type: "SOLID", color: COLORS.text.primary }];
    icon.textAlignHorizontal = "CENTER";
    icon.textAlignVertical = "CENTER";
    icon.x = x - 8;
    icon.y = 142;
    icon.resize(16, 16);
    timelineFrame.appendChild(icon);

    // Add milestone title below
    const title = figma.createText();
    title.fontName = { family: "Roboto", style: "Regular" };
    title.characters = milestone.title;
    title.fontSize = 14;
    title.fills = [{ type: "SOLID", color: COLORS.text.primary }];
    title.textAlignHorizontal = "CENTER";
    title.x = x - 60;
    title.y = 180;
    title.resize(120, 20);
    timelineFrame.appendChild(title);

    // Add date
    const date = figma.createText();
    date.fontName = { family: "Roboto", style: "Regular" };
    date.characters = milestone.date;
    date.fontSize = 12;
    date.fills = [{ type: "SOLID", color: COLORS.text.secondary }];
    date.textAlignHorizontal = "CENTER";
    date.x = x - 60;
    date.y = 205;
    date.resize(120, 16);
    timelineFrame.appendChild(date);
  }

  return timelineFrame;
}

async function createTimelineScreen() {
  // Create main frame for timeline view
  const mainFrame = figma.createFrame();
  mainFrame.name = "Timeline Screen View";
  mainFrame.resize(1920, 1080);
  mainFrame.fills = [{ type: "SOLID", color: COLORS.primary.background }];

  // Create navigation header
  const navHeader = await createNavigationHeader();
  mainFrame.appendChild(navHeader);

  // Create timeline content area
  const contentArea = figma.createFrame();
  contentArea.name = "Timeline Content";
  contentArea.x = 0;
  contentArea.y = 80;
  contentArea.resize(1920, 1000);
  contentArea.fills = [];

  // Timeline header
  const timelineHeader = figma.createFrame();
  timelineHeader.name = "Timeline Header";
  timelineHeader.x = 120;
  timelineHeader.y = 40;
  timelineHeader.resize(1680, 120);
  timelineHeader.fills = [];

  // Title
  const title = figma.createText();
  title.fontName = { family: "Roboto", style: "Regular" };
  title.characters = "🚀 Microsoft Copilot Evolution";
  title.fontSize = 48;
  title.fills = [{ type: "SOLID", color: COLORS.text.primary }];
  title.x = 0;
  title.y = 20;
  timelineHeader.appendChild(title);

  // Status badge
  const statusBadge = figma.createFrame();
  statusBadge.name = "General Availability Badge";
  statusBadge.x = 0;
  statusBadge.y = 80;
  statusBadge.resize(200, 32);
  statusBadge.fills = [{
    type: "GRADIENT_LINEAR",
    gradientTransform: [[1, 0, 0], [0, 1, 0]],
    gradientStops: [
      { color: { r: 0.306, g: 0.804, b: 0.769, a: 1 }, position: 0 },
      { color: { r: 0.420, g: 0.451, b: 1.0, a: 1 }, position: 1 }
    ]
  }];
  statusBadge.cornerRadius = 16;

  const statusText = figma.createText();
  statusText.fontName = { family: "Roboto", style: "Regular" };
  statusText.characters = "General availability";
  statusText.fontSize = 14;
  statusText.fills = [{ type: "SOLID", color: COLORS.text.primary }];
  statusText.textAlignHorizontal = "CENTER";
  statusText.textAlignVertical = "CENTER";
  statusText.x = 0;
  statusText.y = 0;
  statusText.resize(200, 32);
  statusBadge.appendChild(statusText);
  timelineHeader.appendChild(statusBadge);

  // Back to features button
  const backBtn = figma.createFrame();
  backBtn.name = "Back to Features";
  backBtn.x = 1480;
  backBtn.y = 20;
  backBtn.resize(200, 48);
  backBtn.fills = [{ type: "SOLID", color: COLORS.primary.surfaceElevated }];
  backBtn.cornerRadius = 24;
  backBtn.effects = [{
    type: "DROP_SHADOW",
    color: { r: 0, g: 0, b: 0, a: 0.2 },
    offset: { x: 0, y: 4 },
    radius: 12,
    visible: true,
    blendMode: "NORMAL"
  }];

  const backBtnText = figma.createText();
  backBtnText.fontName = { family: "Roboto", style: "Regular" };
  backBtnText.characters = "← Back to Features";
  backBtnText.fontSize = 16;
  backBtnText.fills = [{ type: "SOLID", color: COLORS.text.accent }];
  backBtnText.textAlignHorizontal = "CENTER";
  backBtnText.textAlignVertical = "CENTER";
  backBtnText.x = 0;
  backBtnText.y = 0;
  backBtnText.resize(200, 48);
  backBtn.appendChild(backBtnText);
  timelineHeader.appendChild(backBtn);

  contentArea.appendChild(timelineHeader);

  // Create main timeline visualization
  const timelineViz = await createTimelineVisualization();
  contentArea.appendChild(timelineViz);

  // Add feature details sidebar to timeline view
  const timelineDetailsPanel = await createTimelineDetailsPanel();
  contentArea.appendChild(timelineDetailsPanel);

  mainFrame.appendChild(contentArea);
  return mainFrame;
}

async function createTimelineVisualization() {
  const vizFrame = figma.createFrame();
  vizFrame.name = "Timeline Visualization";
  vizFrame.x = 120;
  vizFrame.y = 200;
  vizFrame.resize(1200, 700); // Adjusted size for feature boxes
  vizFrame.fills = [{ type: "SOLID", color: COLORS.primary.surface }];
  vizFrame.cornerRadius = 24;
  vizFrame.effects = [{
    type: "DROP_SHADOW",
    color: { r: 0, g: 0, b: 0, a: 0.2 },
    offset: { x: 0, y: 8 },
    radius: 32,
    visible: true,
    blendMode: "NORMAL"
  }];

  // Timeline line
  const timelineLine = figma.createLine();
  timelineLine.name = "Main Timeline";
  timelineLine.x = 120;
  timelineLine.y = 400;
  timelineLine.resize(1440, 0);
  timelineLine.strokes = [{ type: "SOLID", color: { r: 0.306, g: 0.804, b: 0.769 } }];
  timelineLine.strokeWeight = 4;
  vizFrame.appendChild(timelineLine);

  // Create milestone points positioned like the PowerPoint
  const milestonePositions = [
    { x: 200, y: 400 }, // GPT-5
    { x: 440, y: 400 }, // Copilot function
    { x: 680, y: 400 }, // Human-agent collab
    { x: 920, y: 400 }, // Copilot Studio
    { x: 1160, y: 400 }, // Copilot Chat
    { x: 1400, y: 400 }  // Role-based AI
  ];

  for (let i = 0; i < MILESTONES.length; i++) {
    const milestone = MILESTONES[i];
    const pos = milestonePositions[i];

    // Milestone circle with number
    const circle = figma.createEllipse();
    circle.name = `Timeline Point ${i + 1}`;
    circle.resize(40, 40);
    circle.x = pos.x - 20;
    circle.y = pos.y - 20;
    circle.fills = [{
      type: "GRADIENT_LINEAR",
      gradientTransform: [[1, 0, 0], [0, 1, 0]],
      gradientStops: [
        { color: { r: 0.306, g: 0.804, b: 0.769, a: 1 }, position: 0 },
        { color: { r: 0.267, g: 0.627, b: 0.553, a: 1 }, position: 1 }
      ]
    }];
    circle.strokes = [{ type: "SOLID", color: COLORS.text.primary }];
    circle.strokeWeight = 2;
    circle.effects = [{
      type: "DROP_SHADOW",
      color: { r: 0.306, g: 0.804, b: 0.769, a: 0.4 },
      offset: { x: 0, y: 4 },
      radius: 16,
      visible: true,
      blendMode: "NORMAL"
    }];
    vizFrame.appendChild(circle);

    // Number in circle
    const number = figma.createText();
    number.fontName = { family: "Roboto", style: "Regular" };
    number.characters = (i + 1).toString();
    number.fontSize = 18;
    number.fills = [{ type: "SOLID", color: COLORS.text.primary }];
    number.textAlignHorizontal = "CENTER";
    number.textAlignVertical = "CENTER";
    number.x = pos.x - 10;
    number.y = pos.y - 10;
    number.resize(20, 20);
    vizFrame.appendChild(number);

    // Feature info above/below timeline - create as clickable boxes
    const isAbove = i % 2 === 0; // Alternate above and below
    const infoY = isAbove ? pos.y - 220 : pos.y + 60;

    // Create feature box container
    const featureBox = figma.createFrame();
    featureBox.name = `Feature Box ${milestone.id}`;
    featureBox.x = pos.x - 120;
    featureBox.y = infoY;
    featureBox.resize(240, 140);
    featureBox.fills = [{ type: "SOLID", color: COLORS.primary.surfaceElevated }];
    featureBox.cornerRadius = 16;
    featureBox.effects = [{
      type: "DROP_SHADOW",
      color: { r: 0, g: 0, b: 0, a: 0.2 },
      offset: { x: 0, y: 4 },
      radius: 16,
      visible: true,
      blendMode: "NORMAL"
    }];
    vizFrame.appendChild(featureBox);

    // Feature icon inside box
    const icon = figma.createText();
    icon.fontName = { family: "Roboto", style: "Regular" };
    icon.characters = milestone.icon;
    icon.fontSize = 32;
    icon.fills = [{ type: "SOLID", color: { r: 0.306, g: 0.804, b: 0.769 } }];
    icon.x = 20;
    icon.y = 20;
    icon.resize(40, 40);
    featureBox.appendChild(icon);

    // Status badge in box
    const statusBadge = figma.createFrame();
    statusBadge.name = "Status";
    statusBadge.x = 160;
    statusBadge.y = 20;
    statusBadge.resize(60, 20);
    statusBadge.fills = [{ type: "SOLID", color: COLORS.primary.backgroundSecondary }];
    statusBadge.cornerRadius = 10;

    const statusText = figma.createText();
    statusText.fontName = { family: "Roboto", style: "Regular" };
    statusText.characters = milestone.status;
    statusText.fontSize = 9;
    statusText.fills = [{ type: "SOLID", color: COLORS.text.accent }];
    statusText.textAlignHorizontal = "CENTER";
    statusText.textAlignVertical = "CENTER";
    statusText.x = 0;
    statusText.y = 0;
    statusText.resize(60, 20);
    statusBadge.appendChild(statusText);
    featureBox.appendChild(statusBadge);

    // Feature title inside box (with better wrapping)
    const featureTitle = figma.createText();
    featureTitle.fontName = { family: "Roboto", style: "Regular" };
    featureTitle.characters = milestone.title;
    featureTitle.fontSize = 14;
    featureTitle.fills = [{ type: "SOLID", color: COLORS.text.primary }];
    featureTitle.x = 20;
    featureTitle.y = 70;
    featureTitle.resize(200, 40); // More width and height for wrapping
    featureBox.appendChild(featureTitle);

    // Date inside box
    const date = figma.createText();
    date.fontName = { family: "Roboto", style: "Regular" };
    date.characters = milestone.date;
    date.fontSize = 11;
    date.fills = [{ type: "SOLID", color: COLORS.text.secondary }];
    date.x = 20;
    date.y = 115;
    date.resize(100, 16);
    featureBox.appendChild(date);

    // Connecting line from circle to feature box
    const connector = figma.createLine();
    connector.name = `Connector ${i + 1}`;
    connector.x = pos.x;
    connector.y = isAbove ? pos.y - 60 : pos.y + 20;
    connector.resize(0, 40); // Always positive height
    connector.strokes = [{ type: "SOLID", color: { r: 0.306, g: 0.804, b: 0.769 } }];
    connector.strokeWeight = 3;
    connector.opacity = 0.6;
    vizFrame.appendChild(connector);
  }

  // Add horizontal scrollbar at bottom
  const scrollbarTrack = figma.createFrame();
  scrollbarTrack.name = "Scrollbar Track";
  scrollbarTrack.x = 120;
  scrollbarTrack.y = 660;
  scrollbarTrack.resize(1000, 8);
  scrollbarTrack.fills = [{ type: "SOLID", color: COLORS.primary.backgroundSecondary }];
  scrollbarTrack.cornerRadius = 4;
  vizFrame.appendChild(scrollbarTrack);

  // Scrollbar thumb (indicates current position)
  const scrollbarThumb = figma.createFrame();
  scrollbarThumb.name = "Scrollbar Thumb";
  scrollbarThumb.x = 0;
  scrollbarThumb.y = 0;
  scrollbarThumb.resize(300, 8); // About 30% of track width
  scrollbarThumb.fills = [{ type: "SOLID", color: { r: 0.306, g: 0.804, b: 0.769 } }];
  scrollbarThumb.cornerRadius = 4;
  scrollbarThumb.effects = [{
    type: "DROP_SHADOW",
    color: { r: 0.306, g: 0.804, b: 0.769, a: 0.3 },
    offset: { x: 0, y: 2 },
    radius: 4,
    visible: true,
    blendMode: "NORMAL"
  }];
  scrollbarTrack.appendChild(scrollbarThumb);

  // Scroll indicators (left/right arrows)
  const leftArrow = figma.createText();
  leftArrow.fontName = { family: "Roboto", style: "Regular" };
  leftArrow.characters = "◀";
  leftArrow.fontSize = 16;
  leftArrow.fills = [{ type: "SOLID", color: COLORS.text.secondary }];
  leftArrow.x = 80;
  leftArrow.y = 658;
  vizFrame.appendChild(leftArrow);

  const rightArrow = figma.createText();
  rightArrow.fontName = { family: "Roboto", style: "Regular" };
  rightArrow.characters = "▶";
  rightArrow.fontSize = 16;
  rightArrow.fills = [{ type: "SOLID", color: COLORS.text.secondary }];
  rightArrow.x = 1140;
  rightArrow.y = 658;
  vizFrame.appendChild(rightArrow);

  return vizFrame;
}

async function createTimelineDetailsPanel() {
  const panel = figma.createFrame();
  panel.name = "Timeline Feature Details";
  panel.x = 1360;
  panel.y = 200;
  panel.resize(520, 600);
  panel.fills = [{ type: "SOLID", color: COLORS.primary.surface }];
  panel.cornerRadius = 16;
  panel.effects = [{
    type: "DROP_SHADOW",
    color: { r: 0, g: 0, b: 0, a: 0.2 },
    offset: { x: 0, y: 8 },
    radius: 24,
    visible: true,
    blendMode: "NORMAL"
  }];

  // Panel header
  const panelTitle = figma.createText();
  panelTitle.fontName = { family: "Roboto", style: "Regular" };
  panelTitle.characters = "Feature Details";
  panelTitle.fontSize = 24;
  panelTitle.fills = [{ type: "SOLID", color: COLORS.text.primary }];
  panelTitle.x = 32;
  panelTitle.y = 32;
  panel.appendChild(panelTitle);

  // Instruction text
  const instruction = figma.createText();
  instruction.fontName = { family: "Roboto", style: "Regular" };
  instruction.characters = "👆 Click on any feature box in the timeline to view detailed information and implementation details.";
  instruction.fontSize = 16;
  instruction.fills = [{ type: "SOLID", color: COLORS.text.secondary }];
  instruction.x = 32;
  instruction.y = 80;
  instruction.resize(456, 80);
  panel.appendChild(instruction);

  // Sample content area
  const contentArea = figma.createFrame();
  contentArea.name = "Detail Content";
  contentArea.x = 32;
  contentArea.y = 180;
  contentArea.resize(456, 380);
  contentArea.fills = [{ type: "SOLID", color: COLORS.primary.backgroundSecondary }];
  contentArea.cornerRadius = 12;
  panel.appendChild(contentArea);

  // Sample content
  const sampleContent = figma.createText();
  sampleContent.fontName = { family: "Roboto", style: "Regular" };
  sampleContent.characters = "📊 Implementation Timeline\n\n🔧 Technical Requirements\n\n📋 Feature Specifications\n\n🎯 Success Metrics\n\n💡 Usage Examples";
  sampleContent.fontSize = 14;
  sampleContent.fills = [{ type: "SOLID", color: COLORS.text.muted }];
  sampleContent.x = 24;
  sampleContent.y = 24;
  sampleContent.resize(408, 330);
  contentArea.appendChild(sampleContent);

  return panel;
}

async function createAddFeatureScreen() {
  // Create main frame for add feature view
  const mainFrame = figma.createFrame();
  mainFrame.name = "Add Feature Screen";
  mainFrame.resize(1920, 1080);
  mainFrame.fills = [{ type: "SOLID", color: COLORS.primary.background }];

  // Create navigation header
  const navHeader = await createNavigationHeader();
  mainFrame.appendChild(navHeader);

  // Create content area
  const contentArea = figma.createFrame();
  contentArea.name = "Add Feature Content";
  contentArea.x = 0;
  contentArea.y = 80;
  contentArea.resize(1920, 1000);
  contentArea.fills = [];

  // Header section
  const headerSection = figma.createFrame();
  headerSection.name = "Header Section";
  headerSection.x = 120;
  headerSection.y = 40;
  headerSection.resize(1680, 120);
  headerSection.fills = [];

  // Title
  const title = figma.createText();
  title.fontName = { family: "Roboto", style: "Regular" };
  title.characters = "✨ Add New Feature";
  title.fontSize = 48;
  title.fills = [{ type: "SOLID", color: COLORS.text.primary }];
  title.x = 0;
  title.y = 20;
  headerSection.appendChild(title);

  // Back button
  const backBtn = figma.createFrame();
  backBtn.name = "Back Button";
  backBtn.x = 1480;
  backBtn.y = 20;
  backBtn.resize(200, 48);
  backBtn.fills = [{ type: "SOLID", color: COLORS.primary.surfaceElevated }];
  backBtn.cornerRadius = 24;
  backBtn.effects = [{
    type: "DROP_SHADOW",
    color: { r: 0, g: 0, b: 0, a: 0.2 },
    offset: { x: 0, y: 4 },
    radius: 12,
    visible: true,
    blendMode: "NORMAL"
  }];

  const backBtnText = figma.createText();
  backBtnText.fontName = { family: "Roboto", style: "Regular" };
  backBtnText.characters = "← Back to Features";
  backBtnText.fontSize = 16;
  backBtnText.fills = [{ type: "SOLID", color: COLORS.text.accent }];
  backBtnText.textAlignHorizontal = "CENTER";
  backBtnText.textAlignVertical = "CENTER";
  backBtnText.x = 0;
  backBtnText.y = 0;
  backBtnText.resize(200, 48);
  backBtn.appendChild(backBtnText);
  headerSection.appendChild(backBtn);

  contentArea.appendChild(headerSection);

  // Main form area
  const formArea = await createAddFeatureForm();
  contentArea.appendChild(formArea);

  mainFrame.appendChild(contentArea);
  return mainFrame;
}

async function createAddFeatureForm() {
  const formContainer = figma.createFrame();
  formContainer.name = "Add Feature Form";
  formContainer.x = 360;
  formContainer.y = 200;
  formContainer.resize(1200, 700);
  formContainer.fills = [{ type: "SOLID", color: COLORS.primary.surface }];
  formContainer.cornerRadius = 24;
  formContainer.effects = [{
    type: "DROP_SHADOW",
    color: { r: 0, g: 0, b: 0, a: 0.2 },
    offset: { x: 0, y: 8 },
    radius: 32,
    visible: true,
    blendMode: "NORMAL"
  }];

  // Form title
  const formTitle = figma.createText();
  formTitle.fontName = { family: "Roboto", style: "Regular" };
  formTitle.characters = "Feature Information";
  formTitle.fontSize = 28;
  formTitle.fills = [{ type: "SOLID", color: COLORS.text.primary }];
  formTitle.x = 48;
  formTitle.y = 48;
  formContainer.appendChild(formTitle);

  // Feature Name Field
  const nameLabel = figma.createText();
  nameLabel.fontName = { family: "Roboto", style: "Regular" };
  nameLabel.characters = "Feature Name *";
  nameLabel.fontSize = 16;
  nameLabel.fills = [{ type: "SOLID", color: COLORS.text.primary }];
  nameLabel.x = 48;
  nameLabel.y = 120;
  formContainer.appendChild(nameLabel);

  const nameInput = figma.createFrame();
  nameInput.name = "Name Input";
  nameInput.x = 48;
  nameInput.y = 150;
  nameInput.resize(520, 48);
  nameInput.fills = [{ type: "SOLID", color: COLORS.primary.backgroundSecondary }];
  nameInput.cornerRadius = 8;
  nameInput.strokes = [{ type: "SOLID", color: { r: 0.306, g: 0.804, b: 0.769 } }];
  nameInput.strokeWeight = 1;

  const namePlaceholder = figma.createText();
  namePlaceholder.fontName = { family: "Roboto", style: "Regular" };
  namePlaceholder.characters = "e.g., Advanced Code Intelligence";
  namePlaceholder.fontSize = 14;
  namePlaceholder.fills = [{ type: "SOLID", color: COLORS.text.muted }];
  namePlaceholder.x = 16;
  namePlaceholder.y = 17;
  nameInput.appendChild(namePlaceholder);
  formContainer.appendChild(nameInput);

  // Release Date Field
  const dateLabel = figma.createText();
  dateLabel.fontName = { family: "Roboto", style: "Regular" };
  dateLabel.characters = "Release Date *";
  dateLabel.fontSize = 16;
  dateLabel.fills = [{ type: "SOLID", color: COLORS.text.primary }];
  dateLabel.x = 620;
  dateLabel.y = 120;
  formContainer.appendChild(dateLabel);

  const dateInput = figma.createFrame();
  dateInput.name = "Date Input";
  dateInput.x = 620;
  dateInput.y = 150;
  dateInput.resize(520, 48);
  dateInput.fills = [{ type: "SOLID", color: COLORS.primary.backgroundSecondary }];
  dateInput.cornerRadius = 8;
  dateInput.strokes = [{ type: "SOLID", color: { r: 0.306, g: 0.804, b: 0.769 } }];
  dateInput.strokeWeight = 1;

  const datePlaceholder = figma.createText();
  datePlaceholder.fontName = { family: "Roboto", style: "Regular" };
  datePlaceholder.characters = "e.g., December 15th";
  datePlaceholder.fontSize = 14;
  datePlaceholder.fills = [{ type: "SOLID", color: COLORS.text.muted }];
  datePlaceholder.x = 16;
  datePlaceholder.y = 17;
  dateInput.appendChild(datePlaceholder);
  formContainer.appendChild(dateInput);

  // Icon Field
  const iconLabel = figma.createText();
  iconLabel.fontName = { family: "Roboto", style: "Regular" };
  iconLabel.characters = "Icon";
  iconLabel.fontSize = 16;
  iconLabel.fills = [{ type: "SOLID", color: COLORS.text.primary }];
  iconLabel.x = 48;
  iconLabel.y = 230;
  formContainer.appendChild(iconLabel);

  const iconInput = figma.createFrame();
  iconInput.name = "Icon Input";
  iconInput.x = 48;
  iconInput.y = 260;
  iconInput.resize(160, 48);
  iconInput.fills = [{ type: "SOLID", color: COLORS.primary.backgroundSecondary }];
  iconInput.cornerRadius = 8;
  iconInput.strokes = [{ type: "SOLID", color: { r: 0.306, g: 0.804, b: 0.769 } }];
  iconInput.strokeWeight = 1;

  const iconPlaceholder = figma.createText();
  iconPlaceholder.fontName = { family: "Roboto", style: "Regular" };
  iconPlaceholder.characters = "🤖";
  iconPlaceholder.fontSize = 24;
  iconPlaceholder.fills = [{ type: "SOLID", color: COLORS.text.muted }];
  iconPlaceholder.textAlignHorizontal = "CENTER";
  iconPlaceholder.textAlignVertical = "CENTER";
  iconPlaceholder.x = 0;
  iconPlaceholder.y = 0;
  iconPlaceholder.resize(130, 48);
  iconInput.appendChild(iconPlaceholder);

  // Dropdown arrow for icon
  const iconDropdown = figma.createText();
  iconDropdown.fontName = { family: "Roboto", style: "Regular" };
  iconDropdown.characters = "▼";
  iconDropdown.fontSize = 12;
  iconDropdown.fills = [{ type: "SOLID", color: COLORS.text.secondary }];
  iconDropdown.x = 135;
  iconDropdown.y = 18;
  iconInput.appendChild(iconDropdown);

  formContainer.appendChild(iconInput);

  // Status Field
  const statusLabel = figma.createText();
  statusLabel.fontName = { family: "Roboto", style: "Regular" };
  statusLabel.characters = "Status";
  statusLabel.fontSize = 16;
  statusLabel.fills = [{ type: "SOLID", color: COLORS.text.primary }];
  statusLabel.x = 250;
  statusLabel.y = 230;
  formContainer.appendChild(statusLabel);

  const statusInput = figma.createFrame();
  statusInput.name = "Status Input";
  statusInput.x = 250;
  statusInput.y = 260;
  statusInput.resize(318, 48);
  statusInput.fills = [{ type: "SOLID", color: COLORS.primary.backgroundSecondary }];
  statusInput.cornerRadius = 8;
  statusInput.strokes = [{ type: "SOLID", color: { r: 0.306, g: 0.804, b: 0.769 } }];
  statusInput.strokeWeight = 1;

  const statusPlaceholder = figma.createText();
  statusPlaceholder.fontName = { family: "Roboto", style: "Regular" };
  statusPlaceholder.characters = "Coming Soon";
  statusPlaceholder.fontSize = 14;
  statusPlaceholder.fills = [{ type: "SOLID", color: COLORS.text.muted }];
  statusPlaceholder.x = 16;
  statusPlaceholder.y = 17;
  statusInput.appendChild(statusPlaceholder);

  // Dropdown arrow for status
  const statusDropdown = figma.createText();
  statusDropdown.fontName = { family: "Roboto", style: "Regular" };
  statusDropdown.characters = "▼";
  statusDropdown.fontSize = 12;
  statusDropdown.fills = [{ type: "SOLID", color: COLORS.text.secondary }];
  statusDropdown.x = 290;
  statusDropdown.y = 18;
  statusInput.appendChild(statusDropdown);

  formContainer.appendChild(statusInput);

  // Description Field
  const descLabel = figma.createText();
  descLabel.fontName = { family: "Roboto", style: "Regular" };
  descLabel.characters = "Description";
  descLabel.fontSize = 16;
  descLabel.fills = [{ type: "SOLID", color: COLORS.text.primary }];
  descLabel.x = 48;
  descLabel.y = 340;
  formContainer.appendChild(descLabel);

  const descInput = figma.createFrame();
  descInput.name = "Description Input";
  descInput.x = 48;
  descInput.y = 370;
  descInput.resize(1104, 120);
  descInput.fills = [{ type: "SOLID", color: COLORS.primary.backgroundSecondary }];
  descInput.cornerRadius = 8;
  descInput.strokes = [{ type: "SOLID", color: { r: 0.306, g: 0.804, b: 0.769 } }];
  descInput.strokeWeight = 1;

  const descPlaceholder = figma.createText();
  descPlaceholder.fontName = { family: "Roboto", style: "Regular" };
  descPlaceholder.characters = "Describe the feature, its capabilities, and benefits...";
  descPlaceholder.fontSize = 14;
  descPlaceholder.fills = [{ type: "SOLID", color: COLORS.text.muted }];
  descPlaceholder.x = 16;
  descPlaceholder.y = 16;
  descPlaceholder.resize(1072, 88);
  descInput.appendChild(descPlaceholder);
  formContainer.appendChild(descInput);

  // Action buttons
  const saveBtn = figma.createFrame();
  saveBtn.name = "Save Button";
  saveBtn.x = 900;
  saveBtn.y = 620;
  saveBtn.resize(140, 48);
  saveBtn.fills = [{
    type: "GRADIENT_LINEAR",
    gradientTransform: [[1, 0, 0], [0, 1, 0]],
    gradientStops: [
      { color: { r: 0.306, g: 0.804, b: 0.769, a: 1 }, position: 0 },
      { color: { r: 0.420, g: 0.451, b: 1.0, a: 1 }, position: 1 }
    ]
  }];
  saveBtn.cornerRadius = 24;
  saveBtn.effects = [{
    type: "DROP_SHADOW",
    color: { r: 0.306, g: 0.804, b: 0.769, a: 0.3 },
    offset: { x: 0, y: 4 },
    radius: 12,
    visible: true,
    blendMode: "NORMAL"
  }];

  const saveBtnText = figma.createText();
  saveBtnText.fontName = { family: "Roboto", style: "Regular" };
  saveBtnText.characters = "💾 Save Feature";
  saveBtnText.fontSize = 16;
  saveBtnText.fills = [{ type: "SOLID", color: COLORS.text.primary }];
  saveBtnText.textAlignHorizontal = "CENTER";
  saveBtnText.textAlignVertical = "CENTER";
  saveBtnText.x = 0;
  saveBtnText.y = 0;
  saveBtnText.resize(140, 48);
  saveBtn.appendChild(saveBtnText);
  formContainer.appendChild(saveBtn);

  const cancelBtn = figma.createFrame();
  cancelBtn.name = "Cancel Button";
  cancelBtn.x = 740;
  cancelBtn.y = 620;
  cancelBtn.resize(140, 48);
  cancelBtn.fills = [{ type: "SOLID", color: COLORS.primary.surfaceElevated }];
  cancelBtn.cornerRadius = 24;
  cancelBtn.strokes = [{ type: "SOLID", color: { r: 0.306, g: 0.804, b: 0.769 } }];
  cancelBtn.strokeWeight = 1;

  const cancelBtnText = figma.createText();
  cancelBtnText.fontName = { family: "Roboto", style: "Regular" };
  cancelBtnText.characters = "Cancel";
  cancelBtnText.fontSize = 16;
  cancelBtnText.fills = [{ type: "SOLID", color: COLORS.text.secondary }];
  cancelBtnText.textAlignHorizontal = "CENTER";
  cancelBtnText.textAlignVertical = "CENTER";
  cancelBtnText.x = 0;
  cancelBtnText.y = 0;
  cancelBtnText.resize(140, 48);
  cancelBtn.appendChild(cancelBtnText);
  formContainer.appendChild(cancelBtn);

  return formContainer;
}

// Main timeline view generation
async function createMainTimelineView() {
  // Create main frame with web-like styling (wider for right panel)
  const mainFrame = figma.createFrame();
  mainFrame.name = "Features Grid View";
  mainFrame.resize(1920, 1080);
  mainFrame.fills = [{ type: "SOLID", color: COLORS.primary.background }]; // Dark theme background

  // Create navigation header
  const navHeader = await createNavigationHeader();
  mainFrame.appendChild(navHeader);

  // Create main content area
  const contentArea = figma.createFrame();
  contentArea.name = "Content Area";
  contentArea.x = 0;
  contentArea.y = 80;
  contentArea.resize(1920, 1000);
  contentArea.fills = [];

  // Create feature grid as main focus
  const featureGrid = await createFeatureGrid();
  contentArea.appendChild(featureGrid);

  // Create right side details panel (reuse timeline version)
  const detailsPanel = await createTimelineDetailsPanel();
  detailsPanel.x = 1264; // Position for features grid view
  detailsPanel.y = 32;
  contentArea.appendChild(detailsPanel);

  mainFrame.appendChild(contentArea);
  return mainFrame;
}

// Main plugin execution
async function main() {
  try {
    await figma.loadFontAsync({ family: "Roboto", style: "Regular" });

    // Generate feature grid view
    const featuresView = await createMainTimelineView();
    featuresView.x = 0;
    featuresView.y = 0;

    // Generate timeline view
    const timelineView = await createTimelineScreen();
    timelineView.x = 2100; // Position next to features view with gap
    timelineView.y = 0;

    // Generate add feature view
    const addFeatureView = await createAddFeatureScreen();
    addFeatureView.x = 4200; // Position next to timeline view
    addFeatureView.y = 0;

    // Add all views to current page
    figma.currentPage.appendChild(featuresView);
    figma.currentPage.appendChild(timelineView);
    figma.currentPage.appendChild(addFeatureView);

    // Focus on the features view first
    figma.viewport.scrollAndZoomIntoView([featuresView]);

    figma.notify("Copilot Features & Timeline created! 🚀");
    figma.closePlugin();

  } catch (error) {
    figma.notify(`Error creating views: ${error.message}`);
    console.error(error);
    figma.closePlugin();
  }
}

// Auto-generate timeline designs immediately when plugin loads
main();