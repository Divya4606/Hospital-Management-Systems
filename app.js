/**
 * CareFlow - Hospital Management System Workflow JavaScript Engine
 * Author: Antigravity AI
 */

// Step Data Store
const workflowData = {
    0: {
        badge: "System Start",
        title: "Initialize CareFlow HMS",
        filename: "hms_bootstrap.sql",
        logic: [
            { title: "Initialize Core Service", desc: "Bootstrap main database connections and activate TLS 1.3 secure endpoints." },
            { title: "Verify Session Tokens", desc: "Check system admin privileges and refresh active JWT session tables." },
            { title: "Flush Cache Rosters", desc: "Clear ephemeral caches and load primary department registers into Redis." }
        ],
        schema: `--CareFlow Database Bootstrapping
CREATE DATABASE CareFlowHMS;
USE CareFlowHMS;

-- System Log Table for audit trailing
CREATE TABLE system_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    event_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    service_name VARCHAR(100) NOT NULL,
    status_code VARCHAR(10) DEFAULT '200_OK',
    details TEXT
);`,
        interactive: `
            <div class="preview-card">
                <div class="preview-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    CareFlow Launch Terminal
                </div>
                <div style="text-align: center; padding: 20px 0;">
                    <div class="status-pulse" style="width: 16px; height: 16px; margin: 0 auto 16px auto;"></div>
                    <h4 style="margin-bottom: 8px;">System Status: Ready to Run</h4>
                    <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 20px;">Deploying a new patient registration ledger on workspace launch.</p>
                    <button class="btn btn-primary" id="btn-init-start">Start Workflow Simulation</button>
                </div>
            </div>
        `
    },
    1: {
        badge: "Module 01",
        title: "Patient Registration",
        filename: "patient_schema.sql",
        logic: [
            { title: "Collect Personal Details", desc: "Acquire first name, last name, date of birth, and gender through encrypted webforms." },
            { title: "Generate Patient ID", desc: "Automatically compute a unique medical ID (e.g., PAT-2026-X) hashing registration timestamps." },
            { title: "Secure PII Storage", desc: "Encrypt sensitive data such as National Identification or SSN using AES-256." }
        ],
        schema: `-- Patient demographics table
CREATE TABLE patients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    dob DATE NOT NULL,
    ssn_encrypted VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    email VARCHAR(100),
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
        interactive: `
            <div class="preview-card">
                <div class="preview-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>
                    New Patient Intake Form
                </div>
                <form id="mock-reg-form" onsubmit="event.preventDefault();">
                    <div class="grid-2">
                        <div class="form-group">
                            <label>First Name</label>
                            <input type="text" class="form-input" id="reg-fname" value="Sarah" required>
                        </div>
                        <div class="form-group">
                            <label>Last Name</label>
                            <input type="text" class="form-input" id="reg-lname" value="Connor" required>
                        </div>
                    </div>
                    <div class="form-group" style="margin-top: 12px;">
                        <label>Date of Birth</label>
                        <input type="date" class="form-input" id="reg-dob" value="1992-11-10" required>
                    </div>
                    <div class="form-group" style="margin-top: 12px;">
                        <label>Contact Phone</label>
                        <input type="tel" class="form-input" id="reg-phone" value="+1 (555) 019-2831">
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 16px;" id="btn-submit-reg">Create Patient ID</button>
                </form>
                <div id="reg-result" style="display:none; padding: 12px; border-radius: var(--radius-sm); background-color: var(--success-glow); border: 1px solid var(--success-color); font-size: 12px;">
                    <strong>Registration Successful!</strong><br>
                    Patient ID: <span id="gen-patient-id" style="font-family: monospace; font-weight:700; color:var(--success-color);">PAT-2026-78401</span>
                </div>
            </div>
        `
    },
    2: {
        badge: "Module 02",
        title: "Doctor Management",
        filename: "doctor_roster.sql",
        logic: [
            { title: "Manage Doctor Profiles", desc: "Build searchable listings of credentials, departments, ratings, and biographies." },
            { title: "Define Availabilities", desc: "Set weekly work rosters, lunch shifts, and emergency availability exceptions." },
            { title: "Expose API Roster", desc: "Feed available slots to scheduling gateways via light, cacheable API responses." }
        ],
        schema: `-- Department and Doctor tables
CREATE TABLE departments (
    dept_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    building VARCHAR(50)
);

CREATE TABLE doctors (
    doctor_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    dept_id INT,
    availability_status VARCHAR(20) DEFAULT 'Available',
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);`,
        interactive: `
            <div class="preview-card">
                <div class="preview-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.8 2.2c0-.7.6-1.2 1.2-1.2h12c.7 0 1.2.6 1.2 1.2V22c0 .6-.5 1.1-1.2 1.1H6c-.6 0-1.2-.5-1.2-1.1V2.2Z"/><path d="M12 5v14M8 12h8"/></svg>
                    Department & Doctors Board
                </div>
                <div class="form-group">
                    <label>Select Department</label>
                    <select class="form-input" id="dept-select">
                        <option value="cardiology">Cardiology Unit</option>
                        <option value="pediatrics">Pediatrics Dept</option>
                        <option value="general" selected>General Medicine</option>
                    </select>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 8px;" id="doctor-list">
                    <!-- Cards will be populated based on select option -->
                </div>
            </div>
        `
    },
    3: {
        badge: "Module 03",
        title: "Appointment Booking",
        filename: "appointments.sql",
        logic: [
            { title: "Select Doctor & Schedule", desc: "Filter by department, doctor availability, and chosen date ranges." },
            { title: "Acquire Slot Reservation", desc: "Create a transient block on the selected timeslot to prevent race conditions." },
            { title: "Notify Doctor & Patient", desc: "Send double confirmation alerts via SMS or Email notifications on commit." }
        ],
        schema: `-- Appointment tracking table
CREATE TABLE appointments (
    appt_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id VARCHAR(20) NOT NULL,
    doctor_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    time_slot TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'Scheduled',
    symptoms VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
);`,
        interactive: `
            <div class="preview-card">
                <div class="preview-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    Appointment Scheduler
                </div>
                <div class="form-group">
                    <label>Target Patient ID</label>
                    <input type="text" class="form-input" id="appt-patient-id" value="PAT-2026-78401" placeholder="Enter ID">
                </div>
                <div class="form-group" style="margin-top: 8px;">
                    <label>Date</label>
                    <input type="date" class="form-input" id="appt-date" value="2026-06-30">
                </div>
                <div class="form-group" style="margin-top: 8px;">
                    <label>Select Time Slot</label>
                    <div class="slots-grid">
                        <div class="slot-btn" data-slot="09:00">09:00 AM</div>
                        <div class="slot-btn selected" data-slot="10:30">10:30 AM</div>
                        <div class="slot-btn" data-slot="14:00">02:00 PM</div>
                    </div>
                </div>
                <button class="btn btn-primary" style="width: 100%; margin-top: 12px;" id="btn-book-appt">Confirm Booking</button>
            </div>
        `
    },
    4: {
        badge: "Module 04",
        title: "Medical Records Update",
        filename: "medical_records.sql",
        logic: [
            { title: "Authenticate Practitioner", desc: "Verify active doctor signature and token writing rights." },
            { title: "Record Clinical Notes", desc: "Update diagnosis logs, vitals, prescriptions, and follow-up directives." },
            { title: "Archive for History", desc: "Store clinical files in highly encrypted records vault for future referrals." }
        ],
        schema: `-- Medical Records & Prescription tables
CREATE TABLE medical_records (
    record_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id VARCHAR(20) NOT NULL,
    doctor_id INT NOT NULL,
    diagnosis VARCHAR(255) NOT NULL,
    treatment_notes TEXT,
    visit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
);

CREATE TABLE prescriptions (
    prescription_id INT PRIMARY KEY AUTO_INCREMENT,
    record_id INT NOT NULL,
    medicine_name VARCHAR(100) NOT NULL,
    dosage VARCHAR(50) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    FOREIGN KEY (record_id) REFERENCES medical_records(record_id)
);`,
        interactive: `
            <div class="preview-card">
                <div class="preview-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    Electronic Health Record Editor
                </div>
                <div class="form-group">
                    <label>Active Diagnosis</label>
                    <input type="text" class="form-input" id="diag-input" value="Seasonal Rhinovirus / Fatigue">
                </div>
                <div class="form-group" style="margin-top: 8px;">
                    <label>Prescribed Treatment</label>
                    <div class="records-prescription-box">
                        <div class="prescription-item">
                            <span>Amoxicillin 500mg</span>
                            <span style="color: var(--text-secondary);">1x Daily (7 Days)</span>
                        </div>
                        <div class="prescription-item" style="margin-top: 4px;">
                            <span>Multivitamins</span>
                            <span style="color: var(--text-secondary);">1x Nightly (30 Days)</span>
                        </div>
                    </div>
                </div>
                <button class="btn btn-primary" style="width: 100%;" id="btn-update-records">Save Record & Prescribe</button>
            </div>
        `
    },
    5: {
        badge: "Module 05",
        title: "Billing & Payment",
        filename: "billing_invoice.sql",
        logic: [
            { title: "Aggregate Treatment Costs", desc: "Retrieve active service codes, medication costs, and consulting fees." },
            { title: "Process Payments", desc: "Support multiple payment channels (Cash, Card, UPI, Netbanking)." },
            { title: "Commit and Close Ledger", desc: "Generate electronic invoices and lock the treatment transaction sheet." }
        ],
        schema: `-- Invoices and Payments tables
CREATE TABLE invoices (
    invoice_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id VARCHAR(20) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0.00,
    total_due DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'Unpaid'
);

CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_id INT NOT NULL,
    amount_paid DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id)
);`,
        interactive: `
            <div class="preview-card">
                <div class="preview-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    Ledger Invoice & Payment Portal
                </div>
                <div class="billing-receipt-block">
                    <div style="text-align: center; margin-bottom: 12px; font-weight:700; border-bottom:1px dashed var(--border-color); padding-bottom:8px;">CAREFLOW INVOICE</div>
                    <div class="receipt-row"><span>General Consult</span> <span>$50.00</span></div>
                    <div class="receipt-row"><span>Lab Diagnostic</span> <span>$45.00</span></div>
                    <div class="receipt-row"><span>Prescriptions</span> <span>$35.00</span></div>
                    <div class="receipt-row total"><span>TOTAL</span> <span>$130.00</span></div>
                </div>
                <div class="form-group" style="margin-top: 8px;">
                    <label>Payment Method</label>
                    <select class="form-input" id="payment-method">
                        <option value="card">Credit / Debit Card</option>
                        <option value="upi">UPI / Instant Pay</option>
                        <option value="cash">Cash</option>
                        <option value="online">Online Netbanking</option>
                    </select>
                </div>
                <button class="btn btn-primary" style="width: 100%;" id="btn-pay-bill">Pay & Generate Receipt</button>
            </div>
        `
    },
    6: {
        badge: "Complete",
        title: "Discharge & Telemetry End",
        filename: "teardown_jobs.sql",
        logic: [
            { title: "Close Ledger Entries", desc: "Flag Patient session status as Checked Out, releasing scheduling locks." },
            { title: "Archival Pipeline", desc: "Trigger automated ETL tools to sync records to high-security archives." },
            { title: "Request Survey", desc: "Schedule automated satisfaction questionnaire logs to email workers." }
        ],
        schema: `-- Archive jobs and session reset triggers
CREATE TRIGGER archive_patient_session
AFTER UPDATE ON invoices
FOR EACH ROW
BEGIN
    IF NEW.status = 'Paid' THEN
        UPDATE appointments 
        SET status = 'Completed' 
        WHERE patient_id = NEW.patient_id AND status = 'Scheduled';
    END IF;
END;`,
        interactive: `
            <div class="preview-card" style="text-align: center; padding: 24px;">
                <div style="font-size: 48px; color: var(--success-color); margin-bottom: 12px;">✓</div>
                <h4 style="margin-bottom: 8px;">Workflow Completed</h4>
                <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 20px;">
                    Patient checkout, billing receipts, and database operations successfully synced.
                </p>
                <div class="form-group" style="text-align:left;">
                    <label>Patient Feedback Score</label>
                    <div style="display:flex; justify-content:space-around; margin-top:8px;">
                        <button class="btn btn-secondary" style="padding:6px 12px;">1 ★</button>
                        <button class="btn btn-secondary" style="padding:6px 12px;">3 ★</button>
                        <button class="btn btn-primary" style="padding:6px 12px;">5 ★</button>
                    </div>
                </div>
                <button class="btn btn-secondary" style="width:100%; margin-top: 16px;" id="btn-restart-sim">Restart Workflow</button>
            </div>
        `
    }
};

// Global State
let currentStep = 1; // Nodes go from 0 (Start) to 6 (End). Main modules are 1-5.
let isDarkTheme = false;
let walkthroughTimer = null;

// Initialize components
document.addEventListener("DOMContentLoaded", () => {
    initApp();
    setupEventListeners();
    setTimeout(renderConnectingLines, 200); // Wait for nodes layout rendering to draw lines
});

// App Initiation
function initApp() {
    // Sync initial step details
    setActiveStep(1);
    
    // Check local storage for theme preference
    if (localStorage.getItem("theme") === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        isDarkTheme = true;
        document.querySelector(".sun-icon").style.display = "none";
        document.querySelector(".moon-icon").style.display = "block";
    }
}

// Window resizing re-draws lines
window.addEventListener("resize", () => {
    renderConnectingLines();
});

// Setup Event Handlers
function setupEventListeners() {
    // Theme toggle
    document.getElementById("theme-toggle").addEventListener("click", () => {
        isDarkTheme = !isDarkTheme;
        if (isDarkTheme) {
            document.documentElement.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
            document.querySelector(".sun-icon").style.display = "none";
            document.querySelector(".moon-icon").style.display = "block";
        } else {
            document.documentElement.removeAttribute("data-theme");
            localStorage.setItem("theme", "light");
            document.querySelector(".sun-icon").style.display = "block";
            document.querySelector(".moon-icon").style.display = "none";
        }
        setTimeout(renderConnectingLines, 50);
    });

    // Step Map click selection
    const nodes = document.querySelectorAll(".workflow-node");
    nodes.forEach(node => {
        node.addEventListener("click", () => {
            clearInterval(walkthroughTimer);
            const stepNum = parseInt(node.getAttribute("data-step"));
            setActiveStep(stepNum);
        });
    });

    // Step Nav Button controls
    document.getElementById("btn-prev").addEventListener("click", () => {
        clearInterval(walkthroughTimer);
        if (currentStep > 0) {
            setActiveStep(currentStep - 1);
        }
    });

    document.getElementById("btn-next").addEventListener("click", () => {
        clearInterval(walkthroughTimer);
        if (currentStep < 6) {
            setActiveStep(currentStep + 1);
        }
    });

    // Walkthrough automation
    document.getElementById("btn-play-walkthrough").addEventListener("click", () => {
        playWalkthrough();
    });

    // Handle Tabs inside Details panel
    const tabs = document.querySelectorAll(".tab-btn");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            
            const targetTab = tab.getAttribute("data-tab");
            document.querySelectorAll(".tab-pane").forEach(pane => {
                pane.classList.remove("active");
            });
            document.getElementById(`tab-${targetTab}`).classList.add("active");
        });
    });
}

// Active Step management
function setActiveStep(step) {
    currentStep = step;
    
    // Update active UI highlights in Left Map
    const nodes = document.querySelectorAll(".workflow-node");
    nodes.forEach(node => {
        const stepNum = parseInt(node.getAttribute("data-step"));
        node.classList.remove("active", "completed");
        
        if (stepNum === step) {
            node.classList.add("active");
        } else if (stepNum < step) {
            node.classList.add("completed");
        }
    });

    // Center selected node in scroll-pane viewport
    const activeNode = document.querySelector(`.workflow-node[data-step="${step}"]`);
    if (activeNode) {
        activeNode.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    // Toggle nav controls
    document.getElementById("btn-prev").disabled = (step === 0);
    document.getElementById("btn-next").disabled = (step === 6);

    // Update Step Tracker text (Steps are 1-5, ignore Start/End in count)
    const trackerText = document.querySelector(".step-tracker");
    if (step === 0) {
        trackerText.innerText = "System Start Entry";
        document.getElementById("current-step-num").innerText = "0";
    } else if (step === 6) {
        trackerText.innerText = "Care Cycle Complete";
        document.getElementById("current-step-num").innerText = "6";
    } else {
        trackerText.innerHTML = `Step <span id="current-step-num">${step}</span> of 5`;
    }

    // Dynamic right Details compilation
    const info = workflowData[step];
    document.getElementById("sim-badge").innerText = info.badge;
    document.getElementById("sim-title").innerText = info.title;
    
    // Schema
    document.getElementById("db-filename").innerText = info.filename;
    document.getElementById("db-code-content").innerHTML = formatSQLCode(info.schema);

    // Business Logic
    const logicList = document.getElementById("logic-list");
    logicList.innerHTML = "";
    info.logic.forEach((item, index) => {
        const li = document.createElement("li");
        li.className = "logic-step-item active";
        li.innerHTML = `
            <div class="logic-step-num">${index + 1}</div>
            <div class="logic-step-desc">
                <h4>${item.title}</h4>
                <p>${item.desc}</p>
            </div>
        `;
        logicList.appendChild(li);
    });

    // Interactive simulator views
    const container = document.getElementById("interactive-preview-placeholder");
    container.innerHTML = info.interactive;

    // Attach step-specific mock behaviors
    attachModuleInteractiveLogic(step);

    // Redraw SVG path highlights
    renderConnectingLines();
}

// Draw dynamic Bezier arrows connecting stages
function renderConnectingLines() {
    const svg = document.getElementById("connections-svg");
    if (!svg) return;
    
    svg.innerHTML = ""; // Clear existing elements
    
    const track = document.getElementById("workflow-track");
    const nodes = Array.from(document.querySelectorAll(".workflow-node")).sort((a, b) => {
        return parseInt(a.getAttribute("data-step")) - parseInt(b.getAttribute("data-step"));
    });

    // Define Arrow Marker
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="context-stroke" />
        </marker>
    `;
    svg.appendChild(defs);

    const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";
    
    // Loop through nodes to draw connecting arrows
    for (let i = 0; i < nodes.length - 1; i++) {
        const fromNode = nodes[i];
        const toNode = nodes[i + 1];

        const stepFrom = parseInt(fromNode.getAttribute("data-step"));
        const stepTo = parseInt(toNode.getAttribute("data-step"));

        // Retrieve positions relative to parent (.workflow-track)
        const fromRect = {
            left: fromNode.offsetLeft,
            top: fromNode.offsetTop,
            width: fromNode.offsetWidth,
            height: fromNode.offsetHeight
        };

        const toRect = {
            left: toNode.offsetLeft,
            top: toNode.offsetTop,
            width: toNode.offsetWidth,
            height: toNode.offsetHeight
        };

        // Coordinates from right center to left center
        const x1 = fromRect.left + fromRect.width;
        const y1 = fromRect.top + (fromRect.height / 2);
        const x2 = toRect.left;
        const y2 = toRect.top + (toRect.height / 2);

        // Control point offsets for beautiful cubic bezier curvature
        const offset = Math.abs(x2 - x1) * 0.45;
        
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const d = `M ${x1} ${y1} C ${x1 + offset} ${y1}, ${x2 - offset} ${y2}, ${x2 - 6} ${y2}`;
        
        path.setAttribute("d", d);
        path.setAttribute("marker-end", "url(#arrow)");
        
        // Define line states
        let lineClass = "connection-line";
        if (stepFrom < currentStep) {
            lineClass += " completed";
        } else if (stepFrom === currentStep) {
            lineClass += " active";
        }
        
        path.setAttribute("class", lineClass);
        svg.appendChild(path);
    }
}

// SQL Syntax Highlighter Helper
function formatSQLCode(sqlText) {
    const keywords = ["CREATE", "DATABASE", "USE", "TABLE", "INT", "PRIMARY", "KEY", "AUTO_INCREMENT", "TIMESTAMP", "DEFAULT", "CURRENT_TIMESTAMP", "VARCHAR", "NOT", "NULL", "TEXT", "UNIQUE", "FOREIGN", "REFERENCES", "DATE", "DECIMAL", "TRIGGER", "AFTER", "UPDATE", "ON", "FOR", "EACH", "ROW", "BEGIN", "IF", "THEN", "ELSE", "END", "IF;"];
    let formatted = sqlText.replace(/--.*/g, match => `<span class="comment">${match}</span>`);

    keywords.forEach(kw => {
        const regex = new RegExp(`\\b${kw}\\b`, "g");
        formatted = formatted.replace(regex, `<span class="keyword">${kw}</span>`);
    });

    formatted = formatted.replace(/('[^']*')/g, `<span class="string">$1</span>`);
    formatted = formatted.replace(/\b(\d+)\b/g, `<span class="number">$1</span>`);
    
    return formatted;
}

// Module-specific interactive mock scripts
function attachModuleInteractiveLogic(step) {
    if (step === 0) {
        document.getElementById("btn-init-start").addEventListener("click", () => {
            showToast("HMS databases successfully established. Starting intake panel...");
            setActiveStep(1);
        });
    }
    
    if (step === 1) {
        const form = document.getElementById("mock-reg-form");
        document.getElementById("btn-submit-reg").addEventListener("click", () => {
            const fname = document.getElementById("reg-fname").value;
            const lname = document.getElementById("reg-lname").value;
            if (!fname || !lname) return;
            
            // Random ID
            const randomID = `PAT-2026-${Math.floor(10000 + Math.random() * 90000)}`;
            document.getElementById("gen-patient-id").innerText = randomID;
            document.getElementById("reg-result").style.display = "block";
            
            // Update other states where Patient ID is used
            workflowData[3].interactive = workflowData[3].interactive.replace('value="PAT-2026-78401"', `value="${randomID}"`);
            
            showToast(`Patient Identity Created: ${randomID}`);
        });
    }

    if (step === 2) {
        const listContainer = document.getElementById("doctor-list");
        const deptSelect = document.getElementById("dept-select");

        const updateDoctors = () => {
            const val = deptSelect.value;
            let docs = [];
            if (val === "cardiology") {
                docs = [
                    { name: "Dr. Marcus Vance", spec: "Senior Cardiologist", initial: "MV", status: "Available" },
                    { name: "Dr. Elena Rostova", spec: "Cardiovascular Surgeon", initial: "ER", status: "Busy" }
                ];
            } else if (val === "pediatrics") {
                docs = [
                    { name: "Dr. Claire Redfield", spec: "Pediatric Consultant", initial: "CR", status: "Available" }
                ];
            } else {
                docs = [
                    { name: "Dr. Andrew House", spec: "Internist Specialist", initial: "AH", status: "Available" },
                    { name: "Dr. Allison Cameron", spec: "General Practitioner", initial: "AC", status: "Available" }
                ];
            }

            listContainer.innerHTML = "";
            docs.forEach((d, idx) => {
                const docDiv = document.createElement("div");
                docDiv.className = `doctor-row ${idx === 0 ? "selected" : ""}`;
                docDiv.innerHTML = `
                    <div class="doctor-avatar">${d.initial}</div>
                    <div class="doctor-info">
                        <h5>${d.name}</h5>
                        <p>${d.spec}</p>
                    </div>
                    <div class="availability-dot ${d.status === "Busy" ? "busy" : ""}" title="${d.status}"></div>
                `;
                
                docDiv.addEventListener("click", () => {
                    document.querySelectorAll(".doctor-row").forEach(r => r.classList.remove("selected"));
                    docDiv.classList.add("selected");
                    showToast(`Selected Dr. ${d.name.split('. ')[1]}`);
                });
                
                listContainer.appendChild(docDiv);
            });
        };

        deptSelect.addEventListener("change", updateDoctors);
        updateDoctors(); // Run initial load
    }

    if (step === 3) {
        const slots = document.querySelectorAll(".slot-btn");
        slots.forEach(slot => {
            slot.addEventListener("click", () => {
                slots.forEach(s => s.classList.remove("selected"));
                slot.classList.add("selected");
                showToast(`Reserved slot: ${slot.getAttribute("data-slot")}`);
            });
        });

        document.getElementById("btn-book-appt").addEventListener("click", () => {
            const patId = document.getElementById("appt-patient-id").value;
            const selectedSlot = document.querySelector(".slot-btn.selected");
            const time = selectedSlot ? selectedSlot.getAttribute("data-slot") : "10:30 AM";
            
            showToast(`Appointment Confirmed! Confirmation SMS sent to ${patId} for slot ${time}.`);
        });
    }

    if (step === 4) {
        document.getElementById("btn-update-records").addEventListener("click", () => {
            const diag = document.getElementById("diag-input").value;
            showToast(`Clinical records successfully saved. ICD-10 Code assigned for: ${diag}`);
        });
    }

    if (step === 5) {
        document.getElementById("btn-pay-bill").addEventListener("click", () => {
            const method = document.getElementById("payment-method").value.toUpperCase();
            showToast(`Transaction approved via ${method}. Invoice marked: PAID`);
            
            // Print receipt output
            const receipt = document.querySelector(".billing-receipt-block");
            receipt.style.borderColor = "var(--success-color)";
            receipt.style.backgroundColor = "var(--success-glow)";
            
            const printMsg = document.createElement("div");
            printMsg.style.textAlign = "center";
            printMsg.style.marginTop = "12px";
            printMsg.style.color = "var(--success-color)";
            printMsg.style.fontWeight = "bold";
            printMsg.style.fontSize = "11px";
            printMsg.innerText = `[PAID VIA ${method}] - TXN_841295`;
            
            // Remove previous payment stamp if exists
            const prevStamp = receipt.querySelector(".receipt-stamp");
            if (prevStamp) prevStamp.remove();
            
            printMsg.className = "receipt-stamp";
            receipt.appendChild(printMsg);
        });
    }

    if (step === 6) {
        document.getElementById("btn-restart-sim").addEventListener("click", () => {
            showToast("Restarting CareFlow HMS simulation database rosters...");
            setActiveStep(1);
        });
    }
}

// Automated Presentation walkthrough
function playWalkthrough() {
    clearInterval(walkthroughTimer);
    
    // Set to step 0 to start
    setActiveStep(0);
    showToast("Starting Automated Presentation Walkthrough...", 2500);

    let next = 1;
    walkthroughTimer = setInterval(() => {
        if (next <= 6) {
            setActiveStep(next);
            showToast(`Navigating to Stage ${next}: ${workflowData[next].title}`, 2500);
            next++;
        } else {
            clearInterval(walkthroughTimer);
            showToast("Presentation walkthrough complete!", 3000);
        }
    }, 4500); // 4.5 seconds per step
}

// Toast Notifications System
function showToast(message, duration = 3000) {
    const toast = document.getElementById("toast");
    const toastMsg = document.getElementById("toast-message");
    
    toastMsg.innerText = message;
    toast.classList.add("show");
    
    // Auto clear
    setTimeout(() => {
        toast.classList.remove("show");
    }, duration);
}
