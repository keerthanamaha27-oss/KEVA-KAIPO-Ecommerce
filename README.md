# AyurVeda Naturals — Authentic Ayurvedic E-Commerce & Social Commerce Platform
## CSI3029: Front End Design and Testing — TH Assessment 1
**Faculty:** Dr. V. Arulkumar (18875)  
**Submission Due Date:** 25-Sep-2026  
**Role:** Digital Solutions Consultant  
**Project Directory:** `C:\Users\Administrator\.gemini\antigravity\scratch\ayur-veda-store`

---

## 🌟 Executive Summary
**AyurVeda Naturals** is a responsive, multi-page e-commerce and social commerce web application developed to modernize a real physical Ayurvedic products apothecary. It incorporates:
- **Classical Ayurvedic Formulation Showcase:** Pure Himalayan Shilajit, KSM-66 Ashwagandha, Ashtanga Kumkumadi Tailam, Swarna Chyawanprash Supreme, and Triphala.
- **Social Commerce Direct Ordering:**
  - Direct Instagram Storefront link (`@ayur.veda.wellness`)
  - 1-Click WhatsApp Order generator (`+91 98765 43210`) with prefilled botanical item descriptions & prices
  - Tap-to-call mobile phone link (`tel:+919876543210`)
- **Automated Email Order Confirmation & Store Admin Verification:**
  - Automated HTML Tax Invoice email dispatched to customer and apothecary upon checkout
  - Interactive email inspection modal
  - Store Admin Order Management Portal (`admin-orders.html`) to transition order states (`Placed` &rarr; `Approved` &rarr; `Shipped`)
- **Automated Front-End Testing Suite:** 14 programmatic test cases at `tests/test-suite.html` verifying cart algorithms, 5% GST taxation, promo vouchers (`AYUR10`, `VEDA150`), and form validation.
- **Academic Assessment Report & PDF:** Complete academic report ready for VTOP upload (`CSI3029_Assessment1_AyurVeda_Report.pdf`).

---

## 📁 Project Architecture & Page Inventory

| File | Purpose & Description |
| :--- | :--- |
| `index.html` | **Storefront Home Page**: Hero banner, Ayurvedic categories, Best sellers, Customer testimonials, Sticky WhatsApp/Instagram buttons |
| `about.html` | **Heritage & Science**: Tri-Dosha philosophy, Sourcing geography (Himalayas, Kashmir, Kerala), Vaidya Advisory Board, Lab certifications |
| `products.html` | **Formulations Catalogue**: Multi-filter by health concern, Tridoshic balance, Price range slider, Search bar, Quick View modal |
| `product-detail.html` | **Deep-Dive Specifications**: Dynamic query param (`?id=AVN-101`), Dosage instructions (Anupana), Ingredients, WhatsApp direct buy |
| `cart.html` | **Shopping Basket**: Dynamic quantity controls, Free shipping progress tracker, Vedic coupon codes (`AYUR10`, `VEDA150`), 1-Click WhatsApp buy |
| `checkout.html` | **Delivery & Payment**: Customer address validation, Phone pattern, Payment mode selection (UPI, COD, Card) |
| `order-confirmation.html` | **Order Confirmation & Tax Invoice**: Unique Order ID (`AVN-2026-XXXX`), Print-ready tax invoice, Dispatched HTML email preview |
| `contact.html` | **Apothecary Clinic**: Store address, Tap-to-call phone, Tele-consultation appointment booking, FAQs accordion |
| `wishlist.html` | **Saved Remedies**: Saved products from `localStorage`, Move to Cart, Remove item |
| `admin-orders.html` | **Store Admin Portal**: Order verification queue, Placed &rarr; Approved status transitions, Gross revenue metrics |
| `tests/test-suite.html` | **Automated Test Suite**: 14 front-end unit and functional test cases (100% Pass rate) |
| `report.html` | **Academic Report (HTML)**: Print-ready academic documentation |
| `CSI3029_Assessment1_AyurVeda_Report.pdf` | **Submission PDF**: Final report compiled with Chrome headless ready for VTOP upload |
| `server.js` | **Local Node.js Server**: Optional zero-dependency static file & email API mock server |
| `css/style.css` | **Ayurvedic Design System**: Imperial forest green, warm gold, parchment cream, responsive media queries |
| `js/products-data.js` | **Botanical Dataset**: Authentic Ayurvedic products with botanical classifications, doshas, and lab standards |
| `js/app.js` | **State Engine**: Cart, Wishlist, WhatsApp/Instagram URL generators, Order service, and Toast notifications |

---

## 🚀 How to Run the Website

### Method 1: Direct Browser Opening (No Server Required)
Simply double click or open any of the HTML files directly in your web browser:
- Double-click `index.html` to open the home page.
- Double-click `tests/test-suite.html` to run the automated tests.
- Double-click `admin-orders.html` to view the store management portal.

### Method 2: Running via Local Node.js Server (Port 3000)
Run the following in PowerShell:
```powershell
cd C:\Users\Administrator\.gemini\antigravity\scratch\ayur-veda-store
node server.js
```
Then visit:
- **Storefront:** `http://localhost:3000`
- **Testing Dashboard:** `http://localhost:3000/tests/test-suite.html`
- **Admin Portal:** `http://localhost:3000/admin-orders.html`

---

## 📤 VTOP Submission Deliverables
1. **PDF File:** `CSI3029_Assessment1_AyurVeda_Report.pdf` is located in this directory and is 100% complete and formatted for VTOP upload.
2. **Source Code:** All HTML, CSS, JavaScript, and test files are located in this folder.
