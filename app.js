// Supabase Configuration - Replace with your own keys
const SUPABASE_URL = "https://caamyofnnhtmiyxqlwys.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_LbtAonGDSg3Mt0NhduGJUg_BLfTHybH";

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Global variables
let currentUser = null;
let currentAudit = null;
let currentSection = 0;
let tempEvidence = [];
let stream = null;
let currentQuestionId = null;
let charts = {};

// =========================
// AUDIT TEMPLATES
// =========================

const auditTemplates = {
  ISO9001: {
    name: "ISO 9001:2015 - Quality Management System",
    sections: [
      {
        title: "4. Context of the Organization",
        questions: [
          {
            id: "4.1",
            text: "How have you identified both internal and external issues that affect the QMS, particularly those unique to marine contracting and jack-up vessel operations? How are market demands, regulatory changes, and technological advancements in the marine industry monitored?",
            guidance:
              "Review strategic planning documents, SWOT analysis, market analysis, regulatory updates",
          },
          {
            id: "4.2",
            text: "What methods are used to identify the needs and expectations of stakeholders such as clients, regulatory authorities, crew, and subcontractors? How do you communicate these requirements internally?",
            guidance:
              "Check stakeholder register, customer requirements, regulatory compliance matrix",
          },
          {
            id: "4.3",
            text: "How is the scope of the QMS defined for both onshore operations and offshore vessel activities? Are any exclusions (e.g., non-applicable vessel operations) justified and documented?",
            guidance:
              "Review scope statement, exclusions documentation, vessel operation boundaries",
          },
          {
            id: "4.4",
            text: "How are key processes for marine operations (vessel management, maintenance, and service delivery) identified, documented, and monitored? Are process maps available that cover both office-based and onboard activities?",
            guidance:
              "Examine process maps, interaction diagrams, vessel procedures, KPIs",
          },
        ],
      },
      {
        title: "5. Leadership",
        questions: [
          {
            id: "5.1",
            text: "How does top management demonstrate leadership and commitment to quality in both corporate and vessel operations? Can you provide examples where management decisions have improved service quality or vessel performance?",
            guidance:
              "Review management meeting minutes, resource allocation, improvement initiatives",
          },
          {
            id: "5.2",
            text: "How is the quality policy developed, communicated, and understood by all levels (including vessel crew and shore-based personnel)? How does the policy incorporate marine service requirements?",
            guidance:
              "Check policy documentation, communication records, crew understanding",
          },
          {
            id: "5.3",
            text: "How are responsibilities allocated for both shore-based and onboard activities? How is accountability ensured for marine-specific processes such as vessel inspection, maintenance, and client service delivery?",
            guidance:
              "Review organization charts, job descriptions, vessel authority matrix",
          },
        ],
      },
      {
        title: "6. Planning",
        questions: [
          {
            id: "6.1",
            text: "What procedures are in place to identify risks and opportunities, including those associated with vessel operations (e.g., weather conditions, equipment failure, offshore hazards)? How are risk assessments and mitigation plans documented?",
            guidance:
              "Review risk registers, HAZID reports, opportunity logs, mitigation plans",
          },
          {
            id: "6.2",
            text: "How are quality objectives set with marine contracting performance indicators (e.g., vessel availability, service delivery timeliness, customer satisfaction)? How are these objectives monitored and reviewed?",
            guidance:
              "Check objectives documentation, KPI dashboards, performance reviews",
          },
          {
            id: "6.3",
            text: "How is change management handled when introducing new equipment, updating vessel procedures, or altering marine services? How are quality implications assessed and communicated?",
            guidance:
              "Review change management procedures, impact assessments, communication records",
          },
        ],
      },
      {
        title: "7. Support",
        questions: [
          {
            id: "7.1",
            text: "How are human, technical, and infrastructural resources allocated for quality activities in both the office and on vessels? Are resource needs regularly reviewed?",
            guidance:
              "Review resource planning, budgets, equipment registers, maintenance schedules",
          },
          {
            id: "7.2",
            text: "How do you ensure the competence of staff and crew for quality-critical tasks (e.g., maintenance, marine operations)? Are certifications and training records up to date?",
            guidance:
              "Check competency matrices, training records, certification tracking",
          },
          {
            id: "7.3",
            text: "How is quality awareness maintained among all employees and crew regarding their roles in delivering quality services? What training or communication programs are in place?",
            guidance:
              "Review awareness programs, training materials, communication campaigns",
          },
          {
            id: "7.4",
            text: "How is effective communication ensured between shore-based management and vessel crews? What communication channels are used to share quality-related information?",
            guidance:
              "Check communication plans, channels, meeting records, vessel reports",
          },
          {
            id: "7.5",
            text: "How is documented information controlled (including vessel procedures, maintenance logs, and quality records)? How are documents accessed, updated, and protected from loss?",
            guidance:
              "Review document control procedures, version control, access logs, backup systems",
          },
        ],
      },
      {
        title: "8. Operation",
        questions: [
          {
            id: "8.1",
            text: "How are operational processes planned and controlled to ensure the safe and effective operation of jack-up vessels? What criteria are used to monitor operational performance?",
            guidance:
              "Review operational plans, control measures, performance criteria, monitoring records",
          },
          {
            id: "8.2",
            text: "How do you determine and manage customer requirements for marine contracting services? How is customer feedback collected and addressed?",
            guidance:
              "Check requirement specifications, contract reviews, feedback mechanisms",
          },
          {
            id: "8.3",
            text: "For any new vessel modifications or service innovations, how are design and development processes controlled? How are changes validated before implementation?",
            guidance:
              "Review design procedures, validation records, change approvals",
          },
          {
            id: "8.4",
            text: "How do you select and monitor suppliers for critical marine equipment, spare parts, and subcontracted services? What evaluation criteria are used?",
            guidance:
              "Check supplier evaluation criteria, performance monitoring, approved vendor lists",
          },
          {
            id: "8.5",
            text: "What controls are in place for the operation and maintenance of jack-up vessels? How do you ensure that service delivery consistently meets customer and regulatory requirements?",
            guidance:
              "Review operational controls, maintenance procedures, service standards",
          },
          {
            id: "8.6",
            text: "How is the release of marine contracting services authorized to ensure that vessels and services meet quality criteria before deployment?",
            guidance:
              "Check release criteria, verification records, authorization procedures",
          },
          {
            id: "8.7",
            text: "How are nonconformities (e.g., vessel maintenance defects, service delivery issues) identified and controlled? What steps are taken to prevent their recurrence?",
            guidance:
              "Review nonconformity procedures, corrective actions, preventive measures",
          },
        ],
      },
      {
        title: "9. Performance Evaluation",
        questions: [
          {
            id: "9.1",
            text: "Which quality performance indicators (including vessel performance, customer satisfaction, and service delivery metrics) are monitored? How are trends analyzed and acted upon?",
            guidance:
              "Review KPI dashboards, trend analysis, performance reports, action plans",
          },
          {
            id: "9.2",
            text: "How is the internal audit program structured to cover both corporate and marine operational activities? Are audit findings effectively addressed?",
            guidance:
              "Check audit programs, schedules, findings, corrective action tracking",
          },
          {
            id: "9.3",
            text: "How often does management review the QMS with a focus on marine contracting performance? What inputs and outputs are documented from these reviews?",
            guidance:
              "Review management review schedules, inputs, outputs, action items",
          },
        ],
      },
      {
        title: "10. Improvement",
        questions: [
          {
            id: "10.1",
            text: "What mechanisms are in place to drive continual improvement in service delivery and vessel performance? How are improvement opportunities identified and prioritized?",
            guidance:
              "Review improvement initiatives, innovation programs, suggestion systems",
          },
          {
            id: "10.2",
            text: "How are nonconformities recorded, investigated, and resolved? Can you provide examples where corrective actions have led to lasting improvements?",
            guidance:
              "Check NC records, root cause analyses, corrective action effectiveness",
          },
          {
            id: "10.3",
            text: "What evidence demonstrates ongoing improvement in quality performance, both in marine operations and overall business results?",
            guidance:
              "Review improvement trends, performance metrics, success stories",
          },
        ],
      },
    ],
  },
  ISO14001: {
    name: "ISO 14001:2015 - Environmental Management System",
    sections: [
      {
        title: "4. Context of the Organization",
        questions: [
          {
            id: "4.1",
            text: "What environmental factors (e.g., marine pollution, ballast water management, emissions) relevant to jack-up vessel operations have been identified?",
            guidance:
              "Review environmental assessments, impact studies, marine pollution risks",
          },
          {
            id: "4.2",
            text: "How do you determine the environmental requirements of stakeholders such as regulatory bodies, local communities, and clients? How are these requirements documented?",
            guidance:
              "Check stakeholder analysis, compliance obligations, requirement registers",
          },
          {
            id: "4.3",
            text: "How is the scope of the EMS defined to include both shore-based activities and marine operations? Are boundaries and applicability clearly documented?",
            guidance:
              "Review EMS scope statement, operational boundaries, vessel coverage",
          },
          {
            id: "4.4",
            text: "How are processes that affect the marine environment (e.g., waste management, fuel handling, emissions control) identified and managed?",
            guidance:
              "Examine process maps, environmental aspect registers, control measures",
          },
        ],
      },
      {
        title: "5. Leadership",
        questions: [
          {
            id: "5.1",
            text: "How does top management demonstrate commitment to environmental stewardship in both corporate and vessel operations?",
            guidance:
              "Review management commitment, resource allocation, environmental initiatives",
          },
          {
            id: "5.2",
            text: "How is the environmental policy developed, communicated, and implemented across all levels, including vessel crews? Does it address marine pollution prevention?",
            guidance:
              "Check policy documentation, communication methods, crew awareness",
          },
          {
            id: "5.3",
            text: "How are environmental responsibilities assigned for both shore-based operations and vessel activities? Who is accountable for environmental performance?",
            guidance:
              "Review responsibility matrices, job descriptions, accountability structures",
          },
        ],
      },
      {
        title: "6. Planning",
        questions: [
          {
            id: "6.1",
            text: "What methods are used to identify and assess environmental risks and opportunities, particularly those associated with marine operations?",
            guidance:
              "Review environmental risk assessments, opportunity registers, impact evaluations",
          },
          {
            id: "6.2",
            text: "How are environmental objectives set (e.g., reducing emissions, improving waste management) for both shore and vessel operations?",
            guidance:
              "Check environmental objectives, targets, action plans, monitoring systems",
          },
          {
            id: "6.3",
            text: "How do you plan and manage changes (such as new fuel types or modifications to vessel systems) that may have environmental impacts?",
            guidance:
              "Review change management procedures, environmental impact assessments",
          },
        ],
      },
      {
        title: "7. Support",
        questions: [
          {
            id: "7.1",
            text: "How are the resources required to support environmental initiatives allocated for both shore and vessel operations?",
            guidance:
              "Review resource planning, environmental budgets, equipment provisions",
          },
          {
            id: "7.2",
            text: "How is environmental competence maintained among personnel and crew, especially regarding spill response, waste segregation, and emissions management?",
            guidance:
              "Check training records, competency assessments, environmental certifications",
          },
          {
            id: "7.3",
            text: "What mechanisms are used to communicate environmental requirements and performance between the office and vessels?",
            guidance:
              "Review communication channels, environmental bulletins, performance reports",
          },
          {
            id: "7.4",
            text: "How is EMS documentation (procedures, permits, compliance records) controlled and maintained, including vessel-specific documents?",
            guidance:
              "Check document control system, permit tracking, compliance records",
          },
        ],
      },
      {
        title: "8. Operation",
        questions: [
          {
            id: "8.1",
            text: "How are operations that may affect the marine environment (e.g., fuel handling, waste discharge) planned and controlled?",
            guidance:
              "Review operational controls, environmental procedures, monitoring systems",
          },
          {
            id: "8.2",
            text: "What emergency response plans are in place for environmental incidents (e.g., oil spills, chemical releases)? How often are drills conducted?",
            guidance:
              "Check emergency response procedures, drill records, response equipment",
          },
        ],
      },
      {
        title: "9. Performance Evaluation",
        questions: [
          {
            id: "9.1",
            text: "Which environmental performance indicators (e.g., emissions, waste generation, fuel consumption) are monitored for vessel operations?",
            guidance:
              "Review environmental KPIs, monitoring data, trend analysis",
          },
          {
            id: "9.2",
            text: "How is compliance with environmental laws and regulations verified, especially in maritime operations across different jurisdictions?",
            guidance:
              "Check compliance evaluations, audit reports, regulatory tracking",
          },
          {
            id: "9.3",
            text: "How is the EMS audited internally to cover both shore and vessel-based operations? What is the frequency and scope of audits?",
            guidance: "Review audit programs, schedules, scope, findings",
          },
          {
            id: "9.4",
            text: "How does management review the EMS, taking into account data from both shore operations and marine activities?",
            guidance:
              "Check management review inputs, outputs, environmental performance data",
          },
        ],
      },
      {
        title: "10. Improvement",
        questions: [
          {
            id: "10.1",
            text: "What mechanisms drive continual environmental improvement, both onshore and onboard vessels? How are improvements measured?",
            guidance:
              "Review improvement programs, environmental projects, success metrics",
          },
          {
            id: "10.2",
            text: "How are environmental nonconformities (e.g., spills, waste mismanagement) identified, investigated, and resolved?",
            guidance:
              "Check incident reports, investigation procedures, corrective actions",
          },
          {
            id: "10.3",
            text: "What evidence demonstrates ongoing improvement in environmental performance? How are improvements measured and communicated?",
            guidance:
              "Review performance trends, improvement metrics, communication records",
          },
        ],
      },
    ],
  },
  ISO45001: {
    name: "ISO 45001:2018 - Occupational Health & Safety Management System",
    sections: [
      {
        title: "4. Context of the Organization",
        questions: [
          {
            id: "4.1",
            text: "What internal and external issues affecting occupational health and safety in marine operations (e.g., offshore hazards, crew welfare) have been identified?",
            guidance:
              "Review OH&S context analysis, hazard registers, marine safety considerations",
          },
          {
            id: "4.2",
            text: "How do you gather the needs and expectations of vessel crews and shore-based staff regarding OH&S? How are worker concerns addressed?",
            guidance:
              "Check worker consultation records, safety committee minutes, feedback systems",
          },
          {
            id: "4.3",
            text: "How is the scope of the OHSMS defined to cover both shipboard operations and shore-based activities? Are all hazardous activities included?",
            guidance:
              "Review OHSMS scope, boundaries, hazardous activity coverage",
          },
          {
            id: "4.4",
            text: "How are key processes for hazard identification, risk assessment, and control implemented for activities on jack-up vessels?",
            guidance:
              "Examine HIRA procedures, risk matrices, control hierarchies",
          },
        ],
      },
      {
        title: "5. Leadership and Worker Participation",
        questions: [
          {
            id: "5.1",
            text: "How does top management demonstrate leadership and commitment to occupational health and safety in both corporate and marine operations?",
            guidance:
              "Review safety leadership, visible commitment, safety tours, resource provision",
          },
          {
            id: "5.2",
            text: "How is the OH&S policy developed, communicated, and maintained, especially for crew members working on jack-up vessels?",
            guidance:
              "Check policy development process, communication methods, crew understanding",
          },
          {
            id: "5.3",
            text: "How are roles and responsibilities for OH&S clearly defined for both shore-based staff and vessel crew? How is accountability ensured?",
            guidance:
              "Review responsibility assignments, accountability systems, safety organization",
          },
          {
            id: "5.4",
            text: "What processes are in place to consult with workers and vessel crews on OH&S issues? How are their concerns and suggestions incorporated?",
            guidance:
              "Check consultation mechanisms, worker participation, safety committees",
          },
        ],
      },
      {
        title: "6. Planning",
        questions: [
          {
            id: "6.1",
            text: "How do you identify hazards (e.g., falls, equipment malfunctions, adverse weather) and assess risks specific to jack-up vessel operations?",
            guidance:
              "Review hazard identification procedures, risk assessments, JSAs, PTWs",
          },
          {
            id: "6.2",
            text: "How are OH&S objectives established for both vessel operations and onshore functions? What performance indicators are used?",
            guidance:
              "Check OH&S objectives, targets, KPIs, monitoring systems",
          },
          {
            id: "6.3",
            text: "How are changes affecting OH&S (e.g., new vessel equipment or revised operating procedures) planned and assessed for safety impact?",
            guidance:
              "Review MOC procedures, safety impact assessments, change communications",
          },
        ],
      },
      {
        title: "7. Support",
        questions: [
          {
            id: "7.1",
            text: "How are the resources required to support the OHSMS (including safety equipment onboard vessels, personnel, and training) allocated?",
            guidance:
              "Review resource allocation, safety equipment registers, training budgets",
          },
          {
            id: "7.2",
            text: "How do you assess and maintain the competence of workers and vessel crews for safety-critical tasks? Are training needs regularly reviewed?",
            guidance:
              "Check competency matrices, training needs analysis, certification tracking",
          },
          {
            id: "7.3",
            text: "How is awareness of OH&S hazards, risks, and safe work practices maintained among all employees and vessel crews?",
            guidance:
              "Review safety awareness programs, toolbox talks, safety campaigns",
          },
          {
            id: "7.4",
            text: "How is OH&S-related information effectively communicated between shore-based management and vessel crews?",
            guidance:
              "Check safety communication channels, alerts, bulletins, reporting systems",
          },
          {
            id: "7.5",
            text: "How is OH&S documentation (procedures, incident reports, training records) controlled and maintained for both office and vessel operations?",
            guidance:
              "Review document control, incident databases, training records management",
          },
        ],
      },
      {
        title: "8. Operation",
        questions: [
          {
            id: "8.1",
            text: "How are work activities and tasks onboard jack-up vessels planned and controlled to manage OH&S risks? Are safe work procedures in place?",
            guidance:
              "Review work planning, PTW systems, JSAs, safety procedures",
          },
          {
            id: "8.2",
            text: "What emergency response plans exist for incidents onboard vessels (e.g., fire, man overboard, medical emergencies)? How are drills conducted?",
            guidance:
              "Check emergency procedures, drill schedules, muster lists, response equipment",
          },
        ],
      },
      {
        title: "9. Performance Evaluation",
        questions: [
          {
            id: "9.1",
            text: "Which OH&S performance indicators (e.g., incident rates, near-miss reporting, lost-time injuries) are tracked for marine operations?",
            guidance:
              "Review safety KPIs, incident statistics, leading/lagging indicators",
          },
          {
            id: "9.2",
            text: "How is the OHSMS audited internally, covering both marine and shore-based operations? What is the frequency and effectiveness?",
            guidance:
              "Check audit programs, schedules, findings, corrective action tracking",
          },
          {
            id: "9.3",
            text: "How does top management review OH&S performance and what inputs are considered (e.g., audit findings, incidents, worker feedback)?",
            guidance:
              "Review management review records, inputs, outputs, action items",
          },
        ],
      },
      {
        title: "10. Improvement",
        questions: [
          {
            id: "10.1",
            text: "What mechanisms drive continual OH&S improvement, both onshore and onboard vessels? How are safety innovations implemented?",
            guidance:
              "Review improvement initiatives, safety innovation programs, best practices",
          },
          {
            id: "10.2",
            text: "How are incidents and nonconformities investigated to determine root causes? How effective are corrective actions in preventing recurrence?",
            guidance:
              "Check incident investigation procedures, root cause analysis, CAPA effectiveness",
          },
          {
            id: "10.3",
            text: "What evidence demonstrates ongoing improvement in OH&S performance? How are safety improvements measured and communicated?",
            guidance:
              "Review safety performance trends, improvement metrics, communication methods",
          },
        ],
      },
    ],
  },
  ISM: {
    name: "ISM Code 2018 - International Safety Management",
    sections: [
      {
        title: "ISM Code Requirements",
        questions: [
          {
            id: "ISM.1",
            text: "Has the company established an international standard for safe management and pollution prevention? Are the SMS objectives clearly defined?",
            guidance:
              "Review SMS documentation, objectives, safety and environmental policy",
          },
          {
            id: "ISM.2",
            text: "Does the company ensure that all applicable vessels comply with ISM Code requirements based on their type and tonnage?",
            guidance:
              "Check vessel compliance matrix, DOC and SMC certificates",
          },
          {
            id: "ISM.3",
            text: "Are key ISM Code terms (Company, DPA, SMS) clearly understood and implemented within the company's structure?",
            guidance:
              "Review definitions, organizational structure, DPA appointment",
          },
          {
            id: "ISM.4",
            text: "Has the company developed and communicated a safety and environmental policy to all employees, both ashore and afloat?",
            guidance:
              "Check policy documentation, communication records, crew awareness",
          },
          {
            id: "ISM.5",
            text: "Does the company ensure safe ship operations and provide adequate shore-based support? How is this demonstrated?",
            guidance:
              "Review operational procedures, shore support systems, resource allocation",
          },
          {
            id: "ISM.6",
            text: "Has the company appointed a Designated Person Ashore (DPA) with direct access to senior management? Are the DPA's duties clearly defined?",
            guidance:
              "Check DPA appointment letter, responsibilities, reporting lines",
          },
          {
            id: "ISM.7",
            text: "Is the Master given overriding authority on safety and pollution prevention matters? How is this responsibility documented and communicated?",
            guidance:
              "Review Master's authority documentation, standing orders, crew awareness",
          },
          {
            id: "ISM.8",
            text: "Are personnel onboard and ashore adequately trained, certified, and familiar with safety procedures? How is competency verified?",
            guidance:
              "Check training records, certificates, familiarization procedures",
          },
          {
            id: "ISM.9",
            text: "Is there a documented SMS covering emergency procedures, operational safety, and reporting requirements? How is it maintained?",
            guidance: "Review SMS manual, procedures, updates, distribution",
          },
          {
            id: "ISM.10",
            text: "Are SMS-related documents properly controlled, updated, and accessible to relevant personnel?",
            guidance:
              "Check document control procedures, version control, accessibility",
          },
          {
            id: "ISM.11",
            text: "Are emergency response procedures in place and regularly tested through drills?",
            guidance:
              "Review emergency procedures, drill records, crew preparedness",
          },
          {
            id: "ISM.12",
            text: "Does the company have a system for reporting and analyzing accidents, near-misses, and non-conformities?",
            guidance:
              "Check reporting procedures, incident analysis, corrective actions",
          },
          {
            id: "ISM.13",
            text: "How is the SMS reviewed and maintained to ensure continual improvement?",
            guidance:
              "Review SMS review procedures, management reviews, improvement actions",
          },
          {
            id: "ISM.14",
            text: "Are internal audits conducted regularly to verify compliance with the ISM Code? Are external audits properly managed?",
            guidance:
              "Check internal audit programs, external audit records, corrective actions",
          },
        ],
      },
    ],
  },
};

// =========================
// APP INITIALISATION
// =========================

document.addEventListener("DOMContentLoaded", async () => {
  // Check authentication
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    currentUser = session.user;
    await loadUserProfile();
    showMainApp();
  } else {
    showLogin();
  }

  // Auth listener
  supabase.auth.onAuthStateChange(async (_event, sessionChange) => {
    if (sessionChange) {
      currentUser = sessionChange.user;
      await loadUserProfile();
      showMainApp();
    } else {
      currentUser = null;
      showLogin();
    }
  });

  // Event listeners
  setupEventListeners();

  // Charts
  initializeCharts();
});

// =========================
// AUTH FUNCTIONS
// =========================

async function login(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    alert("Login failed: " + error.message);
    return null;
  }
}

async function register(email, password, fullName, orgName) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          organization: orgName,
        },
      },
    });

    if (error) throw error;

    // Create profile row
    if (data.user) {
      await createUserProfile(data.user.id, fullName, orgName, email);
    }
    return data;
  } catch (error) {
    alert("Registration failed: " + error.message);
    return null;
  }
}

async function logout() {
  await supabase.auth.signOut();
  showLogin();
}

// =========================
// USER PROFILE
// =========================

async function createUserProfile(userId, fullName, orgName, email) {
  try {
    const { error } = await supabase.from("profiles").insert({
      id: userId,
      full_name: fullName,
      organization: orgName,
      email: email,
    });

    if (error) throw error;
  } catch (error) {
    console.error("Profile creation error:", error);
  }
}

async function loadUserProfile() {
  if (!currentUser) return;

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", currentUser.id)
      .single();

    if (error) throw error;

    if (data) {
      document.getElementById("userName").textContent =
        data.full_name || currentUser.email;
      document.getElementById("userOrg").textContent =
        data.organization || "NMS";

      // Prefill settings
      const settingsName = document.getElementById("settingsName");
      const settingsOrg = document.getElementById("settingsOrg");
      const settingsCert = document.getElementById("settingsCert");
      if (settingsName) settingsName.value = data.full_name || "";
      if (settingsOrg) settingsOrg.value = data.organization || "";
      if (settingsCert) settingsCert.value = data.certification || "";
    }
  } catch (error) {
    console.error("Profile load error:", error);
  }
}

// =========================
// UI SWITCHING
// =========================

function showLogin() {
  document.getElementById("loginScreen").style.display = "flex";
  document.getElementById("registerScreen").style.display = "none";
  document.getElementById("mainApp").style.display = "none";
}

function showRegister() {
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("registerScreen").style.display = "flex";
  document.getElementById("mainApp").style.display = "none";
}

function showMainApp() {
    // Hide auth screens, show app shell
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('registerScreen').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';

    // Activate Dashboard tab
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    const dashTab = document.querySelector('.nav-tab[data-tab="dashboard"]');
    if (dashTab) dashTab.classList.add('active');

    // Show Dashboard content (by class, not inline style)
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    const dashSection = document.getElementById('dashboard');
    if (dashSection) dashSection.classList.add('active');

    // Load data for dashboard + audits list
    loadDashboard();
    loadAudits();
}


// =========================
// EVENT LISTENERS
// =========================

function setupEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        await login(email, password);
        // auth listener will call showMainApp()
    });

    // Register form
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const fullName = document.getElementById('regFullName').value;
        const orgName = document.getElementById('regOrgName').value;
        await register(email, password, fullName, orgName);
        // after signUp you may still need to confirm email depending on settings
    });

    // Tab navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;

            // Switch tab styling
            document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Switch visible section
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            const section = document.getElementById(tabId);
            if (section) section.classList.add('active');

            // Load data per tab
            if (tabId === 'dashboard') {
                loadDashboard();
            } else if (tabId === 'audits') {
                loadAudits();
            } else if (tabId === 'records') {
                loadYearlyRecords();
            } else if (tabId === 'analytics') {
                loadAnalytics();
            }
        });
    });

    // Audit filters
    document.getElementById('filterStandard')?.addEventListener('change', filterAudits);
    document.getElementById('filterStatus')?.addEventListener('change', filterAudits);
    document.getElementById('searchAudits')?.addEventListener('input', filterAudits);

    // Year selector
    document.getElementById('yearSelect')?.addEventListener('change', loadYearlyRecords);

    // Evidence file input
    document.getElementById('fileInput')?.addEventListener('change', handleFileSelect);
}


// =========================
// DASHBOARD
// =========================

async function loadDashboard() {
  if (!currentUser) return;

  try {
    const { data: audits } = await supabase
      .from("audits")
      .select("*")
      .eq("user_id", currentUser.id);

    if (audits) {
      const total = audits.length;
      const completed = audits.filter((a) => a.status === "complete").length;
      const inProgress = audits.filter(
        (a) => a.status === "progress" || a.status === "draft",
      ).length;

      document.getElementById("totalAudits").textContent = total;
      document.getElementById("completedAudits").textContent = completed;
      document.getElementById("pendingAudits").textContent = inProgress;
    }

    const { data: findings } = await supabase
      .from("findings")
      .select("*")
      .eq("user_id", currentUser.id)
      .eq("status", "open");

    if (findings) {
      document.getElementById("totalFindings").textContent = findings.length;
      updateFindingsChart(findings);
    }

    await loadRecentActivities();
    await updateDashboardCharts();
  } catch (error) {
    console.error("Dashboard load error:", error);
  }
}

async function loadRecentActivities() {
  if (!currentUser) return;

  try {
    const { data } = await supabase
      .from("audit_activities")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false })
      .limit(5);

    const container = document.getElementById("recentActivities");
    if (!container) return;

    if (data && data.length > 0) {
      container.innerHTML = data
        .map(
          (activity) => `
        <div class="activity-item">
          <div class="activity-icon">${getActivityIcon(activity.type)}</div>
          <div class="activity-content">
            <div class="activity-title">${activity.title}</div>
            <div class="activity-time">${formatTimeAgo(activity.created_at)}</div>
          </div>
        </div>
      `,
        )
        .join("");
    } else {
      container.innerHTML = '<p class="muted">No recent activities</p>';
    }
  } catch (error) {
    console.error("Activities load error:", error);
  }
}

// =========================
// AUDITS
// =========================

async function loadAudits() {
  if (!currentUser) return;

  try {
    const { data } = await supabase
      .from("audits")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false });

    const container = document.getElementById("auditsList");
    if (!container) return;

    if (data && data.length > 0) {
      container.innerHTML = data
        .map((audit) => createAuditCard(audit))
        .join("");
    } else {
      container.innerHTML = `
        <div style="text-align:center; padding:60px 20px; color:var(--text-light);">
          <div style="font-size:48px; margin-bottom:16px;">📋</div>
          <p>No audits found. Create your first audit to get started.</p>
        </div>
      `;
    }
  } catch (error) {
    console.error("Audits load error:", error);
  }
}

function createAuditCard(audit) {
    const template = auditTemplates[audit.standard];
    const badgeClass = `badge-${audit.standard.toLowerCase()}`;
    const statusBadgeClass = `badge-${audit.status}`;

    return `
        <div class="audit-card" onclick="openAudit('${audit.id}')">
            <div class="audit-header">
                <div>
                    <div class="audit-title">${audit.title}</div>
                    <div class="audit-meta">
                        <span>📅 ${new Date(audit.scheduled_date).toLocaleDateString()}</span>
                        <span>🏢 ${audit.department}</span>
                        <span>📊 ${audit.progress || 0}% Complete</span>
                        ${audit.findings_count != null ? `<span>⚠️ ${audit.findings_count} findings</span>` : ''}
                    </div>
                </div>
                <div style="text-align: right;">
                    <div>
                        <span class="badge ${badgeClass}">${template?.name || audit.standard}</span>
                        <span class="badge ${statusBadgeClass}">${audit.status.toUpperCase()}</span>
                    </div>
                    <button
                        class="btn btn-secondary btn-sm"
                        style="margin-top: 8px;"
                        onclick="event.stopPropagation(); openAudit('${audit.id}')"
                    >
                        ${audit.status === 'draft' || audit.status === 'progress' ? 'Open / Edit' : 'View'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

function openNewAuditModal() {
  const modal = document.getElementById("newAuditModal");
  if (!modal) return;
  modal.classList.add("show");
  const dateInput = document.getElementById("auditDate");
  if (dateInput) {
    dateInput.value = new Date().toISOString().split("T")[0];
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove("show");

  // Stop camera if needed
  if (modalId === "evidenceModal" && stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }
}

async function createAudit() {
  if (!currentUser) return;

  const title = document.getElementById("auditTitle").value;
  const standard = document.getElementById("auditStandard").value;
  const department = document.getElementById("auditDepartment").value;
  const date = document.getElementById("auditDate").value;
  const scope = document.getElementById("auditScope").value;
  const team = document.getElementById("auditTeam").value;

  if (!title || !standard || !department || !date) {
    alert("Please fill in all required fields.");
    return;
  }

  try {
    const { data, error } = await supabase
      .from("audits")
      .insert({
        user_id: currentUser.id,
        title,
        standard,
        department,
        scheduled_date: date,
        scope,
        team,
        status: "draft",
        progress: 0,
      })
      .select()
      .single();

    if (error) throw error;

    await logActivity("audit_created", `Created audit: ${title}`);

    await loadAudits();
    await loadDashboard();

    const form = document.getElementById("newAuditForm");
    if (form) form.reset();
    closeModal("newAuditModal");
  } catch (error) {
    alert("Failed to create audit: " + error.message);
  }
}

async function openAudit(auditId) {
  try {
    const { data } = await supabase
      .from("audits")
      .select("*")
      .eq("id", auditId)
      .single();

    if (data) {
      currentAudit = data;
      currentSection = 0;

      document.getElementById("auditExecutionTitle").textContent = data.title;
      document.getElementById("auditExecutionModal").classList.add("show");

      loadAuditSections();
    }
  } catch (error) {
    console.error("Audit load error:", error);
  }
}

function loadAuditSections() {
  if (!currentAudit) return;
  const template = auditTemplates[currentAudit.standard];
  if (!template) return;

  const container = document.getElementById("auditSections");
  if (!container) return;

  let html = "";

  template.sections.forEach((section, sIndex) => {
    html += `
      <div class="audit-section ${sIndex === 0 ? "active" : ""}" id="section-${sIndex}">
        <h3 class="section-title">${section.title}</h3>
    `;

    section.questions.forEach((question, qIndex) => {
      const questionDomId = `${currentAudit.id}-${sIndex}-${qIndex}`;
      html += `
        <div class="audit-question">
          <div class="question-text">${question.id} - ${question.text}</div>
          <div class="response-options">
            <div class="response-option conform" data-question="${questionDomId}" data-value="conform">✅ Conform</div>
            <div class="response-option minor" data-question="${questionDomId}" data-value="minor">⚠️ Minor NC</div>
            <div class="response-option major" data-question="${questionDomId}" data-value="major">❌ Major NC</div>
            <div class="response-option" data-question="${questionDomId}" data-value="obs">💡 OBS</div>
            <div class="response-option" data-question="${questionDomId}" data-value="na">N/A</div>
          </div>
          <div class="form-group">
            <label>Auditee Evidence / Remarks</label>
            <textarea class="form-control" id="comment-${questionDomId}" rows="3"
              placeholder="Document evidence, observations, or findings"></textarea>
          </div>
          <div class="evidence-container">
            <div class="evidence-button" onclick="openEvidenceModal('${questionDomId}')">
              + Add Evidence (Photo/Document)
            </div>
            <div class="evidence-list" id="evidence-${questionDomId}"></div>
          </div>
          <div style="margin-top:8px; font-size:12px; color:var(--text-light);">
            <em>Guidance: ${question.guidance}</em>
          </div>
        </div>
      `;
    });

    html += "</div>";
  });

  container.innerHTML = html;

  // response option click handlers
  document.querySelectorAll(".response-option").forEach((option) => {
    option.addEventListener("click", function () {
      const questionId = this.dataset.question;
      document
        .querySelectorAll(`[data-question="${questionId}"]`)
        .forEach((opt) => {
          opt.classList.remove("selected");
        });
      this.classList.add("selected");
      updateProgress();
    });
  });

  updateSectionIndicator();
}

function navigateSection(direction) {
  if (!currentAudit) return;
  const template = auditTemplates[currentAudit.standard];
  const totalSections = template.sections.length;

  const currentEl = document.getElementById(`section-${currentSection}`);
  if (currentEl) currentEl.classList.remove("active");

  currentSection += direction;
  if (currentSection < 0) currentSection = 0;
  if (currentSection >= totalSections) currentSection = totalSections - 1;

  const newEl = document.getElementById(`section-${currentSection}`);
  if (newEl) newEl.classList.add("active");

  updateSectionIndicator();
}

function updateSectionIndicator() {
  if (!currentAudit) return;
  const template = auditTemplates[currentAudit.standard];
  const totalSections = template.sections.length;

  const indicator = document.getElementById("sectionIndicator");
  if (indicator) {
    indicator.textContent = `Section ${currentSection + 1} of ${totalSections}`;
  }

  const prevBtn = document.getElementById("prevSection");
  const nextBtn = document.getElementById("nextSection");
  if (prevBtn) prevBtn.disabled = currentSection === 0;
  if (nextBtn) nextBtn.disabled = currentSection === totalSections - 1;
}

function updateProgress() {
  const questions = document.querySelectorAll(".audit-question");
  const totalQuestions = questions.length;
  let answeredQuestions = 0;

  questions.forEach((q) => {
    if (q.querySelector(".response-option.selected")) {
      answeredQuestions++;
    }
  });

  const progress =
    totalQuestions > 0
      ? Math.round((answeredQuestions / totalQuestions) * 100)
      : 0;
  const bar = document.getElementById("auditProgress");
  const text = document.getElementById("progressText");
  if (bar) bar.style.width = `${progress}%`;
  if (text) text.textContent = `${progress}% Complete`;
}

// =========================
// EVIDENCE
// =========================

function openEvidenceModal(questionId) {
  currentQuestionId = questionId;
  const modal = document.getElementById("evidenceModal");
  if (!modal) return;
  modal.classList.add("show");
}

function capturePhoto() {
  const camContainer = document.getElementById("cameraContainer");
  if (camContainer) camContainer.style.display = "block";

  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((mediaStream) => {
      stream = mediaStream;
      const video = document.getElementById("video");
      if (video) video.srcObject = stream;
    })
    .catch((err) => {
      alert("Camera access denied");
      console.error(err);
    });
}

function takePhoto() {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  if (!video || !canvas) return;
  if (!stream) return;

  const context = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0);

  canvas.toBlob(async (blob) => {
    const file = new File([blob], `photo_${Date.now()}.jpg`, {
      type: "image/jpeg",
    });
    await uploadEvidence(file);

    stream.getTracks().forEach((track) => track.stop());
    stream = null;
    const camContainer = document.getElementById("cameraContainer");
    if (camContainer) camContainer.style.display = "none";
  }, "image/jpeg");
}

function selectFile() {
  const input = document.getElementById("fileInput");
  if (input) input.click();
}

async function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    await uploadEvidence(file);
  }
}

async function uploadEvidence(file) {
  if (!currentUser || !currentAudit || !currentQuestionId) return;

  try {
    const fileName = `${currentUser.id}/${currentAudit.id}/${currentQuestionId}/${file.name}`;

    const { data, error } = await supabase.storage
      .from("evidence")
      .upload(fileName, file);

    if (error) throw error;

    const { data: publicData } = supabase.storage
      .from("evidence")
      .getPublicUrl(fileName);

    const publicUrl = publicData.publicUrl;

    const preview = document.getElementById("evidencePreview");
    if (preview) {
      if (file.type.startsWith("image/")) {
        preview.innerHTML = `<img src="${publicUrl}" style="max-width:200px; border-radius:8px;">`;
      } else {
        preview.innerHTML = `<p>📎 ${file.name}</p>`;
      }
    }

    tempEvidence.push({
      url: publicUrl,
      name: file.name,
      type: file.type,
    });
  } catch (error) {
    alert("Failed to upload evidence: " + error.message);
  }
}

async function saveEvidence() {
  if (!currentUser || !currentAudit || !currentQuestionId) return;
  const description =
    document.getElementById("evidenceDescription")?.value || "";

  try {
    for (const evidence of tempEvidence) {
      await supabase.from("evidence").insert({
        audit_id: currentAudit.id,
        question_id: currentQuestionId,
        user_id: currentUser.id,
        url: evidence.url,
        name: evidence.name,
        type: evidence.type,
        description,
      });
    }

    const evidenceList = document.getElementById(
      `evidence-${currentQuestionId}`,
    );
    if (evidenceList) {
      tempEvidence.forEach((evidence) => {
        const item = document.createElement("div");
        item.className = "evidence-item";
        if (evidence.type.startsWith("image/")) {
          item.innerHTML = `<img src="${evidence.url}" alt="${evidence.name}">`;
        } else {
          item.innerHTML = `<div style="padding:20px;">📎</div>`;
        }
        evidenceList.appendChild(item);
      });
    }

    tempEvidence = [];
    const desc = document.getElementById("evidenceDescription");
    const preview = document.getElementById("evidencePreview");
    if (desc) desc.value = "";
    if (preview) preview.innerHTML = "";
    closeModal("evidenceModal");

    await logActivity("evidence_added", "Added evidence");
  } catch (error) {
    alert("Failed to save evidence: " + error.message);
  }
}

// =========================
// SAVE / COMPLETE AUDIT
// =========================

async function saveAuditProgress() {
  if (!currentUser || !currentAudit) return;
  try {
    const responses = [];
    const template = auditTemplates[currentAudit.standard];

    template.sections.forEach((section, sIndex) => {
      section.questions.forEach((question, qIndex) => {
        const questionDomId = `${currentAudit.id}-${sIndex}-${qIndex}`;
        const selected = document.querySelector(
          `[data-question="${questionDomId}"].selected`,
        );
        const comment = document.getElementById(
          `comment-${questionDomId}`,
        )?.value;

        if (selected) {
          responses.push({
            audit_id: currentAudit.id,
            user_id: currentUser.id,
            section: section.title,
            question_id: question.id,
            question_text: question.text,
            response: selected.dataset.value,
            comment,
            created_at: new Date().toISOString(),
          });
        }
      });
    });

    if (responses.length > 0) {
      const { error } = await supabase
        .from("audit_responses")
        .upsert(responses, { onConflict: "audit_id,question_id" });

      if (error) throw error;
    }

    const totalQuestions = template.sections.reduce(
      (sum, s) => sum + s.questions.length,
      0,
    );
    const progress = Math.round((responses.length / totalQuestions) * 100);

    await supabase
      .from("audits")
      .update({
        progress,
        status: "progress",
        updated_at: new Date().toISOString(),
      })
      .eq("id", currentAudit.id);

    alert("Progress saved successfully");
  } catch (error) {
    alert("Failed to save progress: " + error.message);
  }
}

async function completeAudit() {
  if (!currentUser || !currentAudit) return;
  if (
    !confirm(
      "Are you sure you want to complete this audit? This action cannot be undone.",
    )
  )
    return;

  await saveAuditProgress();

  try {
    const findings = [];
    const template = auditTemplates[currentAudit.standard];

    template.sections.forEach((section, sIndex) => {
      section.questions.forEach((question, qIndex) => {
        const questionDomId = `${currentAudit.id}-${sIndex}-${qIndex}`;
        const selected = document.querySelector(
          `[data-question="${questionDomId}"].selected`,
        );
        const comment = document.getElementById(
          `comment-${questionDomId}`,
        )?.value;

        if (
          selected &&
          ["minor", "major", "obs"].includes(selected.dataset.value)
        ) {
          findings.push({
            audit_id: currentAudit.id,
            user_id: currentUser.id,
            type: selected.dataset.value,
            section: section.title,
            question: question.text,
            description: comment || "",
            status: "open",
            created_at: new Date().toISOString(),
          });
        }
      });
    });

    if (findings.length > 0) {
      await supabase.from("findings").insert(findings);
    }

    await supabase
      .from("audits")
      .update({
        status: "complete",
        progress: 100,
        completed_at: new Date().toISOString(),
        findings_count: findings.length,
      })
      .eq("id", currentAudit.id);

    await logActivity(
      "audit_completed",
      `Completed audit: ${currentAudit.title}`,
    );

    alert("Audit completed successfully!");
    closeModal("auditExecutionModal");
    await loadAudits();
    await loadDashboard();
  } catch (error) {
    alert("Failed to complete audit: " + error.message);
  }
}

// =========================
// FILTERS
// =========================

function filterAudits() {
  const standardFilter = document.getElementById("filterStandard")?.value || "";
  const statusFilter = document.getElementById("filterStatus")?.value || "";
  const search = (
    document.getElementById("searchAudits")?.value || ""
  ).toLowerCase();

  const cards = document.querySelectorAll(".audit-card");
  cards.forEach((card) => {
    const title =
      card.querySelector(".audit-title")?.textContent.toLowerCase() || "";
    const cardStandard = card.dataset.standard || "";
    const cardStatus = card.dataset.status || "";

    let show = true;

    if (standardFilter && cardStandard !== standardFilter) show = false;
    if (statusFilter && cardStatus !== statusFilter) show = false;
    if (search && !title.includes(search)) show = false;

    card.style.display = show ? "block" : "none";
  });
}

// =========================
// YEARLY RECORDS
// =========================

async function loadYearlyRecords() {
  if (!currentUser) return;
  const year = document.getElementById("yearSelect")?.value;
  if (!year) return;

  try {
    const { data: audits } = await supabase
      .from("audits")
      .select("*")
      .eq("user_id", currentUser.id)
      .gte("scheduled_date", `${year}-01-01`)
      .lte("scheduled_date", `${year}-12-31`);

    const { data: findings } = await supabase
      .from("findings")
      .select("*")
      .eq("user_id", currentUser.id)
      .gte("created_at", `${year}-01-01`)
      .lte("created_at", `${year}-12-31`);

    const totalAudits = audits?.length || 0;
    const completedAudits =
      audits?.filter((a) => a.status === "complete").length || 0;
    const complianceRate =
      totalAudits > 0 ? Math.round((completedAudits / totalAudits) * 100) : 0;

    const majorNC = findings?.filter((f) => f.type === "major").length || 0;
    const minorNC = findings?.filter((f) => f.type === "minor").length || 0;

    document.getElementById("yearTotalAudits").textContent = totalAudits;
    document.getElementById("yearCompliance").textContent =
      `${complianceRate}%`;
    document.getElementById("yearMajorNC").textContent = majorNC;
    document.getElementById("yearMinorNC").textContent = minorNC;

    updateYearlyCharts(audits || [], findings || []);
    loadRecurringFindings(findings || []);
  } catch (error) {
    console.error("Yearly records error:", error);
  }
}

function loadRecurringFindings(findings) {
  const container = document.getElementById("recurringFindings");
  if (!container) return;

  if (!findings || findings.length === 0) {
    container.innerHTML = '<p class="muted">No findings recorded</p>';
    return;
  }

  const grouped = {};
  findings.forEach((f) => {
    if (!grouped[f.section]) grouped[f.section] = [];
    grouped[f.section].push(f);
  });

  const sorted = Object.entries(grouped)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 5);

  const html = sorted
    .map(
      ([section, items]) => `
    <div style="padding:12px; background:var(--light); border-radius:8px; margin-bottom:12px;">
      <strong>${section}</strong>
      <span style="float:right; color:var(--danger);">${items.length} findings</span>
    </div>
  `,
    )
    .join("");

  container.innerHTML = html;
}

// =========================
// CHARTS
// =========================

function initializeCharts() {
  const trendCtx = document.getElementById("trendChart")?.getContext("2d");
  if (trendCtx) {
    charts.trend = new Chart(trendCtx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Audits Completed",
            data: [0, 0, 0, 0, 0, 0],
            borderColor: "rgb(79, 70, 229)",
            backgroundColor: "rgba(79, 70, 229, 0.1)",
            tension: 0.4,
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });
  }

  const findingsCtx = document
    .getElementById("findingsChart")
    ?.getContext("2d");
  if (findingsCtx) {
    charts.findings = new Chart(findingsCtx, {
      type: "doughnut",
      data: {
        labels: ["Major NC", "Minor NC", "Observations"],
        datasets: [
          {
            data: [0, 0, 0],
            backgroundColor: [
              "rgb(239, 68, 68)",
              "rgb(245, 158, 11)",
              "rgb(59, 130, 246)",
            ],
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });
  }
}

async function updateDashboardCharts() {
  // You can compute real monthly completed audits here if needed.
}

function updateFindingsChart(findings) {
  if (!charts.findings) return;
  const major = findings.filter((f) => f.type === "major").length;
  const minor = findings.filter((f) => f.type === "minor").length;
  const obs = findings.filter((f) => f.type === "obs").length;

  charts.findings.data.datasets[0].data = [major, minor, obs];
  charts.findings.update();
}

function updateYearlyCharts(audits, _findings) {
  const monthlyCtx = document.getElementById("monthlyChart")?.getContext("2d");
  if (monthlyCtx && !charts.monthly) {
    const monthlyData = Array(12).fill(0);
    audits.forEach((audit) => {
      if (!audit.scheduled_date) return;
      const month = new Date(audit.scheduled_date).getMonth();
      monthlyData[month]++;
    });

    charts.monthly = new Chart(monthlyCtx, {
      type: "bar",
      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            label: "Audits",
            data: monthlyData,
            backgroundColor: "rgba(79, 70, 229, 0.8)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  const standardsCtx = document
    .getElementById("standardsChart")
    ?.getContext("2d");
  if (standardsCtx && !charts.standards) {
    const standardsData = {};
    audits.forEach((audit) => {
      standardsData[audit.standard] = (standardsData[audit.standard] || 0) + 1;
    });

    charts.standards = new Chart(standardsCtx, {
      type: "pie",
      data: {
        labels: Object.keys(standardsData),
        datasets: [
          {
            data: Object.values(standardsData),
            backgroundColor: [
              "rgb(79, 70, 229)",
              "rgb(16, 185, 129)",
              "rgb(245, 158, 11)",
              "rgb(239, 68, 68)",
            ],
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });
  }
}

// =========================
// ANALYTICS
// =========================

async function loadAnalytics() {
  const deptCtx = document.getElementById("deptChart")?.getContext("2d");
  if (deptCtx && !charts.dept) {
    charts.dept = new Chart(deptCtx, {
      type: "bar",
      data: {
        labels: [
          "Marine Ops",
          "Quality",
          "Safety",
          "Environment",
          "Engineering",
        ],
        datasets: [
          {
            label: "Compliance Rate",
            data: [95, 88, 92, 85, 90],
            backgroundColor: "rgba(16, 185, 129, 0.8)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, max: 100 },
        },
      },
    });
  }

  const actionCtx = document.getElementById("actionChart")?.getContext("2d");
  if (actionCtx && !charts.action) {
    charts.action = new Chart(actionCtx, {
      type: "doughnut",
      data: {
        labels: ["Open", "In Progress", "Closed", "Overdue"],
        datasets: [
          {
            data: [0, 0, 0, 0],
            backgroundColor: [
              "rgb(59, 130, 246)",
              "rgb(245, 158, 11)",
              "rgb(16, 185, 129)",
              "rgb(239, 68, 68)",
            ],
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });
  }
}

// =========================
// SETTINGS
// =========================

async function saveSettings() {
  if (!currentUser) return;
  const name = document.getElementById("settingsName")?.value || "";
  const org = document.getElementById("settingsOrg")?.value || "";
  const cert = document.getElementById("settingsCert")?.value || "";

  try {
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: name,
        organization: org,
        certification: cert,
        updated_at: new Date().toISOString(),
      })
      .eq("id", currentUser.id);

    if (error) throw error;

    alert("Settings saved successfully");
    await loadUserProfile();
  } catch (error) {
    alert("Failed to save settings: " + error.message);
  }
}

// =========================
// UTILITIES
// =========================

async function logActivity(type, title) {
  if (!currentUser) return;
  try {
    await supabase.from("audit_activities").insert({
      user_id: currentUser.id,
      type,
      title,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Activity log error:", error);
  }
}

function getActivityIcon(type) {
  const icons = {
    audit_created: "📋",
    audit_completed: "✅",
    finding_created: "⚠️",
    evidence_added: "📎",
  };
  return icons[type] || "📌";
}

function formatTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)} days ago`;

  return new Date(date).toLocaleDateString();
}
