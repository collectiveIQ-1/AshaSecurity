import { useEffect, useMemo, useRef, useState } from "react";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext.jsx";
import Stepper from "../components/Stepper.jsx";
import { Field } from "../components/Field.jsx";
import { Input } from "../components/Input.jsx";
import { Select } from "../components/Select.jsx";
import FileUpload from "../components/FileUpload.jsx";
import PhoneInput from "../components/PhoneInput.jsx";
import rawCountries from "../data/CountryCodes.json";
import formBg from "../assets/form.jpg";
import formBgLight from "../assets/formLight.jpg";

import ClientAgreement from "../components/ClientAgreement.jsx";
import CreditFacilityAgreementLocalIndividual from "../components/CreditFacilityAgreementLocalIndividual.jsx";
import CreditFacilityAgreementLocalCorporate from "../components/CreditFacilityAgreementLocalCorporate.jsx";
import Schedule1LocalIndividual from "../components/Schedule1LocalIndividual.jsx";
import Schedule2LocalIndividual from "../components/Schedule2LocalIndividual.jsx";
import UploadSignaturesLocalIndividual from "../components/UploadSignaturesLocalIndividual.jsx";
import PaymentInstructionLocalIndividual from "../components/PaymentInstructionLocalIndividual.jsx";
import PaymentInstructionLocalCorporate from "../components/PaymentInstructionLocalCorporate.jsx";
import DirectionOnlineForm from "../components/DirectionOnlineForm.jsx";
import CorporateClientRegistration from "../components/CorporateClientRegistration.jsx";
import LocalCorporateNewForm from "../components/LocalCorporateNewForm.jsx";
import KYCForm from "../components/KYCForm.jsx";
import BeneficialOwnershipForm from "../components/BeneficialOwnershipForm.jsx";
import AdditionalRequirements from "../components/AdditionalRequirements.jsx";
import ForeignIndividualClientRegistration from "../components/ForeignIndividualClientRegistration.jsx";
import ForeignIndividualDeclaration from "../components/ForeignIndividualDeclaration.jsx";
import ForeignIndividualClientAgreement from "../components/ForeignIndividualClientAgreement.jsx";
import ForeignIndividualDirectionOnlineForm from "../components/ForeignIndividualDirectionOnlineForm.jsx";
import ForeignIndividualUnifiedForm from "../components/ForeignIndividualUnifiedForm.jsx";
import ForeignCorporateNewForm from "../components/ForeignCorporateNewForm.jsx";
import ForeignCorporateKYCForm from "../components/ForeignCorporateKYCForm.jsx";
import ForeignCorporateBeneficialOwnershipForm from "../components/ForeignCorporateBeneficialOwnershipForm.jsx";
import ForeignCorporateAdditionalRequirements from "../components/ForeignCorporateAdditionalRequirements.jsx";
import { fetchApplicationForEdit, submitApplication, updateApplication } from "../lib/api.js";
import { loadDraft, saveDraft, clearDraft } from "../lib/draft.js";
import { FormErrorProvider } from "../forms/FormErrorContext.jsx";


const agreementDigitsOnly = (value) => String(value || "").replace(/[^\d]/g, "");

const clampAgreementDatePart = (part, value) => {
  const digits = agreementDigitsOnly(value);
  if (part === "day") return digits.slice(0, 2);
  if (part === "month") return digits.slice(0, 2);
  if (part === "year") return digits.slice(0, 4);
  return digits;
};

const normalizeAgreementDatePart = (part, value) => {
  const raw = clampAgreementDatePart(part, value);
  if (!raw) return "";
  const num = Number(raw);
  if (Number.isNaN(num)) return "";

  if (part === "day") return String(Math.min(Math.max(num, 1), 31)).padStart(raw.length === 2 ? 2 : 1, "0");
  if (part === "month") return String(Math.min(Math.max(num, 1), 12)).padStart(raw.length === 2 ? 2 : 1, "0");
  if (part === "year") return raw;
  return raw;
};


function buildPreviewSnapshot(root, options = {}) {
  if (!root) return "";
  const clone = root.cloneNode(true);
  const formVariant = options.formVariant || "";
  const isForeignIndividualPreview = formVariant === "foreign_individual";
  const isLocalIndividualPreview = formVariant === "local_individual";
  const isIndividualPreview = isLocalIndividualPreview || isForeignIndividualPreview;

  const originalControls = root.querySelectorAll("input, textarea, select");
  const cloneControls = clone.querySelectorAll("input, textarea, select");

  const createSignaturePreviewCard = (doc, { badge, title, helper, imageUrl, alt }) => {
    if (!imageUrl) return null;

    const wrap = doc.createElement("div");
    wrap.className = "mt-4 md:col-span-2";
    wrap.innerHTML = `
      <div class="group overflow-hidden rounded-[30px] border border-zinc-200/90 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition">
        <div class="relative border-b border-zinc-200/80 px-5 py-4">
          <div class="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-zinc-900 via-zinc-700 to-zinc-500"></div>
          <div class="pl-3">
            <div class="inline-flex items-center rounded-full border border-zinc-200 bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500 shadow-sm">${badge}</div>
            <div class="mt-2 text-base font-semibold text-zinc-900">${title}</div>
            <div class="mt-1 text-xs leading-5 text-zinc-600">${helper}</div>
          </div>
        </div>
        <div class="bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.95),rgba(244,244,245,0.65)_42%,rgba(228,228,231,0.45))] px-5 py-5">
          <div class="rounded-[24px] border border-dashed border-zinc-300/90 bg-white/90 p-4 shadow-inner shadow-zinc-200/40">
            <img src="${imageUrl}" alt="${alt}" class="h-28 w-full object-contain" />
          </div>
        </div>
      </div>`;

    return wrap;
  };

  const createDualSignaturePreviewCard = (doc, { badge, title, helper, left, right }) => {
    if (!left?.imageUrl && !right?.imageUrl) return null;

    const panel = (item) => {
      if (!item?.imageUrl) {
        return `
          <div class="rounded-[24px] border border-dashed border-zinc-200 bg-white/70 p-4 text-center text-xs text-zinc-400">
            ${item?.emptyText || "Signature not uploaded"}
          </div>`;
      }

      return `
        <div class="rounded-[24px] border border-dashed border-zinc-300/90 bg-white/90 p-4 shadow-inner shadow-zinc-200/40">
          <div class="mb-3 inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">${item.label || "Signature"}</div>
          <img src="${item.imageUrl}" alt="${item.alt || item.label || "Signature preview"}" class="h-24 w-full object-contain" />
        </div>`;
    };

    const wrap = doc.createElement("div");
    wrap.className = "mt-4 md:col-span-2";
    wrap.innerHTML = `
      <div class="group overflow-hidden rounded-[30px] border border-zinc-200/90 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition">
        <div class="relative border-b border-zinc-200/80 px-5 py-4">
          <div class="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-zinc-900 via-zinc-700 to-zinc-500"></div>
          <div class="pl-3">
            <div class="inline-flex items-center rounded-full border border-zinc-200 bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500 shadow-sm">${badge}</div>
            <div class="mt-2 text-base font-semibold text-zinc-900">${title}</div>
            <div class="mt-1 text-xs leading-5 text-zinc-600">${helper}</div>
          </div>
        </div>
        <div class="bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.95),rgba(244,244,245,0.65)_42%,rgba(228,228,231,0.45))] px-5 py-5">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            ${panel(left)}
            ${panel(right)}
          </div>
        </div>
      </div>`;

    return wrap;
  };

  const createMultiSignaturePreviewCard = (doc, { badge, title, helper, items = [] }) => {
    const visibleItems = items.filter((item) => item?.imageUrl);
    if (!visibleItems.length) return null;

    const wrap = doc.createElement("div");
    wrap.className = "mt-4 md:col-span-2";
    wrap.innerHTML = `
      <div class="group overflow-hidden rounded-[30px] border border-zinc-200/90 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition">
        <div class="relative border-b border-zinc-200/80 px-5 py-4">
          <div class="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-zinc-900 via-zinc-700 to-zinc-500"></div>
          <div class="pl-3">
            <div class="inline-flex items-center rounded-full border border-zinc-200 bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500 shadow-sm">${badge}</div>
            <div class="mt-2 text-base font-semibold text-zinc-900">${title}</div>
            <div class="mt-1 text-xs leading-5 text-zinc-600">${helper}</div>
          </div>
        </div>
        <div class="bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.95),rgba(244,244,245,0.65)_42%,rgba(228,228,231,0.45))] px-5 py-5">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            ${visibleItems.map((item) => `
              <div class="rounded-[24px] border border-dashed border-zinc-300/90 bg-white/90 p-4 shadow-inner shadow-zinc-200/40">
                <div class="mb-3 inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">${item.label || "Signature"}</div>
                <img src="${item.imageUrl}" alt="${item.alt || item.label || "Signature preview"}" class="h-24 w-full object-contain" />
              </div>`).join("")}
          </div>
        </div>
      </div>`;

    return wrap;
  };

  const insertAfterFieldPath = (path, node) => {
    if (!path || !node) return false;
    const field = clone.querySelector(`[data-path="${path}"]`);
    if (!field?.parentNode) return false;

    const afterNode = field.nextElementSibling && field.nextElementSibling.tagName === "BR"
      ? field.nextElementSibling.nextSibling
      : field.nextSibling;

    field.parentNode.insertBefore(node, afterNode || null);
    return true;
  };

  const insertAfterFieldBlockPath = (path, node) => {
    if (!path || !node) return false;
    const field = clone.querySelector(`[data-path="${path}"]`);
    if (!field) return false;

    const fieldBlock = field.closest('.space-y-2')
      || field.closest('.space-y-1')
      || field.parentElement;

    const parent = fieldBlock?.parentNode;
    if (!fieldBlock || !parent) return false;

    parent.insertBefore(node, fieldBlock.nextSibling || null);
    return true;
  };

  const insertBeforeFieldBlockPath = (path, node) => {
    if (!path || !node) return false;
    const field = clone.querySelector(`[data-path="${path}"]`);
    if (!field) return false;

    const fieldBlock = field.closest('.space-y-2')
      || field.closest('.space-y-1')
      || field.parentElement;

    const parent = fieldBlock?.parentNode;
    if (!fieldBlock || !parent) return false;

    parent.insertBefore(node, fieldBlock);
    return true;
  };

  const findNodeByExactText = (text) => {
    const nodes = Array.from(clone.querySelectorAll('div, span, p, label, h1, h2, h3, h4, h5, h6'));
    return nodes.find((node) => String(node.textContent || '').trim() === text) || null;
  };

  const insertLocalAdvisorPreviewCard = (node) => {
    if (!node) return false;

    node.className = 'mt-3';
    node.setAttribute('data-preview-advisor-signature', 'local-individual');

    if (insertAfterFieldBlockPath('clientRegistration.officeUseOnly.advisorsName', node)) {
      return true;
    }

    const field = clone.querySelector('[data-path="clientRegistration.officeUseOnly.advisorsName"]');
    const officeCard = field?.closest('.rounded-3xl');
    if (officeCard) {
      const wrapper = clone.ownerDocument.createElement('div');
      wrapper.className = 'mt-4';
      wrapper.appendChild(node);
      officeCard.appendChild(wrapper);
      return true;
    }

    return false;
  };

  const insertForeignAdvisorPreviewCard = (node) => {
    if (!node) return false;
    const remarksHeading = findNodeByExactText('Remarks');
    const remarksCard = remarksHeading?.closest('div[class*="rounded"]') || remarksHeading?.parentElement;
    const remarksParent = remarksCard?.parentNode;

    if (remarksCard && remarksParent) {
      node.className = 'mt-3';
      node.setAttribute('data-preview-advisor-signature', 'foreign-individual');
      remarksParent.insertBefore(node, remarksCard);
      return true;
    }

    return insertAfterFieldBlockPath('fiClientRegistration.officeUseOnly.advisorsName', node);
  };

  originalControls.forEach((control, index) => {
    const copy = cloneControls[index];
    if (!copy) return;

    const tag = (control.tagName || "").toLowerCase();
    const type = (control.getAttribute("type") || "").toLowerCase();

    if (tag === "textarea") {
      copy.textContent = control.value || "";
      return;
    }

    if (tag === "select") {
      const selectedValue = control.value || "";
      copy.value = selectedValue;

      Array.from(copy.options || []).forEach((opt, optIndex) => {
        const isSelected = selectedValue
          ? opt.value === selectedValue
          : !!control.options?.[optIndex]?.selected;

        opt.selected = isSelected;
        if (isSelected) opt.setAttribute("selected", "selected");
        else opt.removeAttribute("selected");
      });
      return;
    }

    if (type === "checkbox" || type === "radio") {
      if (control.checked) copy.setAttribute("checked", "checked");
      else copy.removeAttribute("checked");
      return;
    }

    if (type === "file") {
      copy.setAttribute("value", "");
      return;
    }

    copy.setAttribute("value", control.value || "");
  });

  clone.querySelectorAll("input, textarea, select, button").forEach((el) => {
    el.setAttribute("disabled", "disabled");
  });

  clone.querySelectorAll("iframe").forEach((el) => {
    const title = el.getAttribute("title") || "Uploaded document preview";
    const wrap = el.ownerDocument.createElement("div");
    wrap.className = "mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-300";
    wrap.textContent = `${title} is attached and will be included with the application.`;
    el.replaceWith(wrap);
  });

  const previewImageMap = options.previewImageMap || {};
  const normalizeText = (value) => String(value || "").replace(/\s+/g, " ").trim().toLowerCase();

  const insertBeforeDeclarationSection = (node) => {
    if (!node) return false;

    const headingNodes = Array.from(clone.querySelectorAll("h1, h2, h3, h4, h5, h6, div, span, p"));
    const declarationHeading = headingNodes.find((el) => normalizeText(el.textContent) === "client declaration & authorization");
    if (!declarationHeading) return false;

    const anchor = declarationHeading.closest("section, article")
      || declarationHeading.closest(".rounded-3xl")
      || declarationHeading.parentElement;

    if (!anchor?.parentNode) return false;

    const wrapper = clone.ownerDocument.createElement("div");
    wrapper.className = "mb-5 md:col-span-2";
    wrapper.setAttribute("data-preview-advisor-before-declaration", "true");
    wrapper.appendChild(node);
    anchor.parentNode.insertBefore(wrapper, anchor);
    return true;
  };

  const insertBeforeTextHeading = (node, headingNeedles = [], options = {}) => {
    if (!node || !headingNeedles.length) return false;

    const nodes = Array.from(clone.querySelectorAll("h1, h2, h3, h4, h5, h6, div, span, p"));
    const headingNode = nodes.find((el) => {
      const text = normalizeText(el.textContent);
      return headingNeedles.some((needle) => text.includes(normalizeText(needle)));
    });

    if (!headingNode) return false;

    const anchor = headingNode.closest(options.closestSelector || "section, article, .rounded-3xl")
      || headingNode.parentElement
      || headingNode;

    if (!anchor?.parentNode) return false;

    const wrapper = clone.ownerDocument.createElement("div");
    wrapper.className = options.wrapperClassName || "mt-4 md:col-span-2";
    if (options.dataAttribute) {
      wrapper.setAttribute(options.dataAttribute, "true");
    }
    wrapper.appendChild(node);
    anchor.parentNode.insertBefore(wrapper, anchor);
    return true;
  };

  const localIndividualPrincipalSignature = previewImageMap.localIndividualPrincipalSignature || "";
  if (localIndividualPrincipalSignature) {
    const signatureWrap = createSignaturePreviewCard(clone.ownerDocument, {
      badge: "Principal Applicant",
      title: "Signature Preview",
      helper: "Uploaded signature shown here for review only.",
      imageUrl: localIndividualPrincipalSignature,
      alt: "Principal applicant signature preview",
    });

    if (!insertAfterFieldPath("clientRegistration.principal.employerContactNo", signatureWrap)) {
      const headings = Array.from(clone.querySelectorAll("h1, h2, h3, h4, h5, h6, div, span, p"));
      const jointHeading = headings.find((node) => String(node.textContent || "").trim() === "Joint Applicant");
      if (jointHeading && signatureWrap) {
        const anchor = jointHeading.closest("section, article, div") || jointHeading;
        anchor.parentNode?.insertBefore(signatureWrap, anchor);
      }
    }
  }

  const jointApplicantSignature = previewImageMap.jointApplicantSignature || "";
  if (jointApplicantSignature) {
    const jointSignatureCard = createSignaturePreviewCard(clone.ownerDocument, {
      badge: "Joint Applicant",
      title: "Signature Preview",
      helper: "This uploaded signature is echoed here to make the applicant review area more polished and easier to scan.",
      imageUrl: jointApplicantSignature,
      alt: "Joint applicant signature preview",
    });

    insertAfterFieldPath("uploads.liJointIdBack", jointSignatureCard)
      || insertAfterFieldPath("fiClientRegistration.jointApplicant.identityBack", jointSignatureCard);
  }

  const secondJointApplicantSignature = previewImageMap.secondJointApplicantSignature || "";
  if (secondJointApplicantSignature) {
    const secondJointSignatureCard = createSignaturePreviewCard(clone.ownerDocument, {
      badge: "2nd Joint Applicant",
      title: "Signature Preview",
      helper: "Placed right after the applicant details so the preview feels complete without changing the actual form layout.",
      imageUrl: secondJointApplicantSignature,
      alt: "2nd joint applicant signature preview",
    });

    insertAfterFieldPath("clientRegistration.secondJointApplicant.fax", secondJointSignatureCard)
      || insertAfterFieldPath("fiClientRegistration.secondJointApplicant.fax", secondJointSignatureCard);
  }

  const authorizerSignature = previewImageMap.authorizerSignature || "";
  const clientSignature = previewImageMap.clientSignature || "";
  const advisorSignature = previewImageMap.advisorSignature || "";
  const witness1Signature = previewImageMap.witness1Signature || "";
  const witness2Signature = previewImageMap.witness2Signature || "";
  const companySealSignature = previewImageMap.companySealSignature || authorizerSignature || "";

  if (isIndividualPreview) {
    const privacyNoticeSignatureCard = createMultiSignaturePreviewCard(clone.ownerDocument, {
      badge: "Privacy Notice Review",
      title: "Client, Authorizer & Witness Signatures",
      helper: "Shown only in preview, just before the Privacy Notice & Data Collection Consent Clause, so the final review section looks polished and easy to verify.",
      items: [
        {
          label: "Client",
          imageUrl: clientSignature,
          alt: "Client signature preview before privacy notice",
        },
        {
          label: "Authorizer",
          imageUrl: authorizerSignature,
          alt: "Authorizer signature preview before privacy notice",
        },
        {
          label: "Witness 1",
          imageUrl: witness1Signature,
          alt: "Witness 1 signature preview before privacy notice",
        },
        {
          label: "Witness 2",
          imageUrl: witness2Signature,
          alt: "Witness 2 signature preview before privacy notice",
        },
      ],
    });

    if (privacyNoticeSignatureCard) {
      const insertedBeforePrivacyNotice = insertBeforeTextHeading(privacyNoticeSignatureCard, ["Privacy Notice & Data Collection Consent Clause"], {
        wrapperClassName: "mt-4 mb-6 md:col-span-2",
        dataAttribute: "data-preview-privacy-notice-signatures",
      });

      if (!insertedBeforePrivacyNotice) {
        const finalPrivacyWrapper = clone.ownerDocument.createElement("section");
        finalPrivacyWrapper.className = "mt-6 w-full";
        finalPrivacyWrapper.setAttribute("data-preview-privacy-notice-signatures-fallback", "true");
        finalPrivacyWrapper.appendChild(privacyNoticeSignatureCard);
        clone.appendChild(finalPrivacyWrapper);
      }
    }

    const declarationServicesSignatureCard = createMultiSignaturePreviewCard(clone.ownerDocument, {
      badge: "Declaration Review",
      title: "Applicant Signatures",
      helper: "Shown only in preview, right after the services-provided note, so the declaration area looks cleaner and easier to review.",
      items: [
        {
          label: "Principal Applicant",
          imageUrl: localIndividualPrincipalSignature,
          alt: "Principal applicant signature preview",
        },
        {
          label: "Joint 1",
          imageUrl: jointApplicantSignature,
          alt: "Joint applicant signature preview",
        },
        {
          label: "Joint 2",
          imageUrl: secondJointApplicantSignature,
          alt: "2nd joint applicant signature preview",
        },
        {
          label: "Authorizer",
          imageUrl: authorizerSignature,
          alt: "Authorizer signature preview",
        },
      ],
    });

    if (declarationServicesSignatureCard) {
      const insertedAtTargetSection = isLocalIndividualPreview
        ? insertBeforeTextHeading(declarationServicesSignatureCard, ["Remarks:"], {
            wrapperClassName: "mt-4 mb-4 md:col-span-2",
            dataAttribute: "data-preview-services-signatures",
          })
        : isForeignIndividualPreview
          ? insertBeforeTextHeading(declarationServicesSignatureCard, ["Know Your Customer (KYC) Profile"], {
              wrapperClassName: "mt-4 mb-6 md:col-span-2",
              dataAttribute: "data-preview-services-signatures",
            })
          : false;

      if (!insertedAtTargetSection) {
        const serviceNeedles = [
          "services provided: - online facility, research reports.",
          "services provided: online facility, research reports.",
        ];
        const serviceNodes = Array.from(clone.querySelectorAll("p, div, span"));
        const serviceNode = serviceNodes.find((node) => {
          const text = normalizeText(node.textContent);
          return serviceNeedles.some((needle) => text.includes(needle));
        });

        if (serviceNode?.parentNode) {
          const wrapper = clone.ownerDocument.createElement("div");
          wrapper.className = "mt-4 md:col-span-2";
          wrapper.setAttribute("data-preview-services-signatures", "true");
          wrapper.appendChild(declarationServicesSignatureCard);
          const insertionPoint = serviceNode.nextElementSibling || serviceNode.nextSibling || null;
          serviceNode.parentNode.insertBefore(wrapper, insertionPoint);
        }
      }
    }
  }

  if (isIndividualPreview && advisorSignature) {
    const advisorRegistrationCard = createSignaturePreviewCard(clone.ownerDocument, {
      badge: "Client Registration",
      title: "Advisor Signature Preview",
      helper: isForeignIndividualPreview
        ? "Displayed only in preview, neatly between Advisor's Name and the Remarks section, for a cleaner office-use review flow."
        : "Displayed only in preview, neatly between Advisor's Name and Client Declaration & Authorization, for a cleaner office-use review flow.",
      imageUrl: advisorSignature,
      alt: "Advisor signature preview after advisor name",
    });

    const insertedRightAfterAdvisorName = isForeignIndividualPreview
      ? insertForeignAdvisorPreviewCard(advisorRegistrationCard)
      : isLocalIndividualPreview
        ? insertLocalAdvisorPreviewCard(advisorRegistrationCard)
        : insertAfterFieldBlockPath("clientRegistration.officeUseOnly.advisorsName", advisorRegistrationCard)
          || insertAfterFieldBlockPath("fiClientRegistration.officeUseOnly.advisorsName", advisorRegistrationCard);

    if (!insertedRightAfterAdvisorName) {
      insertBeforeDeclarationSection(advisorRegistrationCard);
    }
  }

  if (isIndividualPreview && (clientSignature || companySealSignature || witness1Signature || witness2Signature)) {
    const schedule1SignatureCard = createMultiSignaturePreviewCard(clone.ownerDocument, {
      badge: "Schedule 1 Signature Review",
      title: "Client, Company Seal & Witness Signatures",
      helper: "Displayed only in preview, neatly before the SCHEDULE 1 main section so the agreement flow looks cleaner and more polished.",
      items: [
        {
          label: "Client",
          imageUrl: clientSignature,
          alt: "Client signature preview before Schedule 1",
        },
        {
          label: "Company Seal",
          imageUrl: companySealSignature,
          alt: "Company seal preview before Schedule 1",
        },
        {
          label: "Witness 1",
          imageUrl: witness1Signature,
          alt: "Witness 1 signature preview before Schedule 1",
        },
        {
          label: "Witness 2",
          imageUrl: witness2Signature,
          alt: "Witness 2 signature preview before Schedule 1",
        },
      ],
    });

    const insertSchedule1SignatureCard = () => {
      if (!schedule1SignatureCard) return false;

      const scheduleHeadings = Array.from(clone.querySelectorAll('div, span, p, h1, h2, h3, h4, h5, h6'));
      const scheduleHeading = scheduleHeadings.find((node) => {
        const text = normalizeText(node.textContent);
        return text === 'schedule 1' || text.startsWith('schedule 1 -') || text.startsWith('schedule 1 ');
      });

      const scheduleCard = scheduleHeading?.closest('.rounded-3xl, .rounded-2xl, .rounded-xl, section, article') || scheduleHeading?.parentElement;
      const scheduleParent = scheduleCard?.parentNode;

      if (scheduleCard && scheduleParent) {
        const wrapper = clone.ownerDocument.createElement('div');
        wrapper.className = isLocalIndividualPreview ? 'mt-5 mb-6' : 'mt-5 mb-6 md:col-span-2';
        wrapper.setAttribute('data-preview-schedule1-signatures', formVariant || 'individual');
        wrapper.appendChild(schedule1SignatureCard);
        scheduleParent.insertBefore(wrapper, scheduleCard);
        return true;
      }

      const scheduleField = clone.querySelector('[data-path="paymentInstruction.schedule1.authorizedPersonFullName"], [data-path="fiDeclaration.schedule1.authorizedPersonFullName"]');
      const scheduleSection = scheduleField?.closest('.rounded-3xl, .rounded-2xl, .rounded-xl, section, article');
      const scheduleSectionParent = scheduleSection?.parentNode;
      if (scheduleSection && scheduleSectionParent) {
        const wrapper = clone.ownerDocument.createElement('div');
        wrapper.className = 'mt-5';
        wrapper.setAttribute('data-preview-schedule1-signatures', formVariant || 'individual');
        wrapper.appendChild(schedule1SignatureCard);
        scheduleSectionParent.insertBefore(wrapper, scheduleSection);
        return true;
      }

      return false;
    };

    if (!insertSchedule1SignatureCard() && schedule1SignatureCard) {
      const finalSection = clone.ownerDocument.createElement('section');
      finalSection.className = 'mt-8 w-full';
      finalSection.setAttribute('data-preview-schedule1-signature-tail', 'true');
      finalSection.appendChild(schedule1SignatureCard);
      clone.appendChild(finalSection);
    }
  }

  if (clientSignature || advisorSignature) {
    const declarationSignatureCard = createDualSignaturePreviewCard(clone.ownerDocument, {
      badge: isForeignIndividualPreview ? "Final Preview" : "Declaration by the Staff",
      title: "Client & Advisor Signatures",
      helper: isForeignIndividualPreview
        ? "These uploaded signatures are displayed at the very end of the foreign individual preview so the full review reads in a cleaner, more polished top-to-bottom flow."
        : "These uploaded signatures are echoed here right after the declaration note so the preview feels cleaner, more complete, and easier to review.",
      left: {
        label: "Client Signature",
        imageUrl: clientSignature,
        alt: "Client signature preview",
        emptyText: "Client signature not uploaded",
      },
      right: {
        label: "Advisor Signature",
        imageUrl: advisorSignature,
        alt: "Advisor signature preview",
        emptyText: "Advisor signature not uploaded",
      },
    });

    if (isForeignIndividualPreview && declarationSignatureCard) {
      declarationSignatureCard.className = `w-full ${declarationSignatureCard.className || ""}`.trim();

      const foreignInstructionField = clone.querySelector('[data-path="fiClientRegistration.authorizedInstructions.nameAndAddress"]');
      const instructionFieldShell = foreignInstructionField?.closest('.space-y-2')
        || foreignInstructionField?.parentElement;
      const instructionParent = instructionFieldShell?.parentNode;

      if (instructionFieldShell && instructionParent) {
        const wrapper = clone.ownerDocument.createElement('div');
        wrapper.className = 'mb-4 md:col-span-2';
        wrapper.setAttribute('data-preview-foreign-signatures', 'true');
        wrapper.appendChild(declarationSignatureCard);
        instructionParent.insertBefore(wrapper, instructionFieldShell);
      } else {
        const finalSection = clone.ownerDocument.createElement('section');
        finalSection.className = 'mt-8 w-full';
        finalSection.setAttribute('data-preview-signature-tail', 'true');

        const divider = clone.ownerDocument.createElement('div');
        divider.className = 'mb-4 h-px w-full bg-gradient-to-r from-transparent via-zinc-300 to-transparent';

        finalSection.appendChild(divider);
        finalSection.appendChild(declarationSignatureCard);
        clone.appendChild(finalSection);
      }

      return clone.innerHTML;
    }

    const normalizedDeclarationNeedles = [
      "investment advisor on behalf of the asha security ltd has clearly explained the risk disclosure statement to the client while inviting to the client to the read and ask question and take independent advice if the client wishes.",
      "(investment advisor) on behalf of the asha securities ltd has clearly explained the risk disclosure statement to the client while inviting the client to read and ask questions and take independent advice if the client wishes.",
    ];
    const declarationNodes = Array.from(clone.querySelectorAll("p, div, span"));

    const insertDeclarationCardAfterNote = (anchorPath) => {
      const anchorField = clone.querySelector(`[data-path="${anchorPath}"]`);
      if (!anchorField) return false;

      const candidateScopes = [
        anchorField.closest(".rounded-3xl"),
        anchorField.closest("section"),
        anchorField.closest("article"),
        anchorField.parentElement,
      ].filter(Boolean);

      for (const scope of candidateScopes) {
        const scopedNodes = Array.from(scope.querySelectorAll("p, div, span"));
        const noteNode = scopedNodes.find((node) => {
          const text = normalizeText(node.textContent);
          return normalizedDeclarationNeedles.some((needle) => text.includes(needle));
        });

        if (!noteNode) continue;

        const noteRow = noteNode.closest(".grid") || noteNode;
        const insertionParent = noteRow.parentNode;
        if (!insertionParent) continue;

        const wrapper = clone.ownerDocument.createElement("div");
        wrapper.className = "mt-4 md:col-span-2 lg:col-span-2";
        wrapper.appendChild(declarationSignatureCard);
        insertionParent.insertBefore(wrapper, noteRow.nextSibling || null);
        return true;
      }

      return false;
    };

    const insertedAfterScopedDeclaration = insertDeclarationCardAfterNote("clientRegistration.staffDeclaration.advisorName")
      || insertDeclarationCardAfterNote("declaration.staffName");

    if (!insertedAfterScopedDeclaration && declarationSignatureCard) {
      const declarationTextNode = declarationNodes.find((node) => {
        const text = normalizeText(node.textContent);
        return normalizedDeclarationNeedles.some((needle) => text.includes(needle));
      });

      if (declarationTextNode?.parentNode) {
        const declarationElement = declarationTextNode.nodeType === 1 ? declarationTextNode : declarationTextNode.parentElement;
        const declarationParent = declarationElement?.parentElement;
        const parentClasses = String(declarationParent?.className || "");
        const elementClasses = String(declarationElement?.className || "");
        const parentLooksLikeGrid = /grid|grid-cols|gap-/.test(parentClasses);
        const elementAlreadySpansRow = /col-span/.test(elementClasses);

        if (declarationElement && declarationParent && parentLooksLikeGrid && !elementAlreadySpansRow) {
          const wrapper = clone.ownerDocument.createElement("div");
          wrapper.className = "mt-3 md:col-span-2 lg:col-span-2";

          declarationParent.insertBefore(wrapper, declarationElement);
          wrapper.appendChild(declarationElement);
          wrapper.appendChild(declarationSignatureCard);
        } else {
          declarationTextNode.parentNode.insertBefore(declarationSignatureCard, declarationTextNode.nextSibling || null);
        }
      }
    }
  }

  return clone.innerHTML;
}
function AgreementTextBox({ value, onChange, onBlur, placeholder, w = "w-24", disabled = false, inputMode = "text", maxLength }) {
  return (
    <input
      value={value || ""}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      placeholder={placeholder}
      inputMode={inputMode}
      maxLength={maxLength}
      className={`${w} h-8 px-2 text-sm border border-zinc-900/70 bg-white/80 text-zinc-900 outline-none transition focus:ring-2 focus:ring-black/20 dark:border-zinc-200/70 dark:bg-zinc-950/30 dark:text-zinc-100 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    />
  );
}

// Clamp typed date years to 4 digits (keeps calendar picker intact)
const isoToDmy = (value) => {
  const s = String(value || "");
  const m = s.match(/^\s*(\d{4})-(\d{2})-(\d{2})\s*$/);
  if (!m) return value;
  return `${m[3]}/${m[2]}/${m[1]}`;
};

const dmyToIso = (value) => {
  const s = String(value || "");
  const m = s.match(/^\s*(\d{1,2})\/(\d{1,2})\/(\d{4})\s*$/);
  if (!m) return value;
  const dd = m[1].padStart(2, "0");
  const mm = m[2].padStart(2, "0");
  const yyyy = m[3];
  return `${yyyy}-${mm}-${dd}`;
};

const clampDateYear4 = (value) => {
  if (!value) return value;

  // Supports both ISO (YYYY-MM-DD) and DD/MM/YYYY typed values.
  const s = String(value);
  if (s.includes("/")) {
    const parts = s.split("/");
    if (parts[2]) parts[2] = parts[2].slice(0, 4);
    return parts.join("/").slice(0, 10);
  }

  // Default: YYYY-MM-DD
  const parts = s.split("-");
  if (parts[0] && parts[0].length > 4) parts[0] = parts[0].slice(0, 4);
  return parts.join("-").slice(0, 10);
};


import {
  localIndividualSteps,
  localIndividualEmpty,
} from "../forms/localIndividualConfig.js";

import {
  localCorporateSteps,
  localCorporateEmpty,
} from "../forms/localCorporateConfig.js";

import {
  foreignIndividualSteps,
  foreignIndividualEmpty,
} from "../forms/foreignIndividualConfig.js";

import {
  foreignCorporateSteps,
  foreignCorporateEmpty,
} from "../forms/foreignCorporateConfig.js";

const isLocalIndividual = (region, type) =>
  region === "local" && type === "individual";

const isLocalCorporate = (region, type) =>
  region === "local" && type === "corporate";

const isForeignIndividual = (region, type) =>
  region === "foreign" && type === "individual";


const isForeignCorporate = (region, type) =>
  region === "foreign" && type === "corporate";


function clone(v) {
  if (typeof globalThis.structuredClone === "function") return globalThis.structuredClone(v);
  return v === undefined ? undefined : JSON.parse(JSON.stringify(v));
}

function isPlainObject(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function deepMerge(base, override) {
  // Merges `override` into `base` (without mutating inputs)
  if (!isPlainObject(base) || !isPlainObject(override)) return clone(override ?? base);

  const out = clone(base);
  for (const [k, v] of Object.entries(override || {})) {
    if (isPlainObject(v) && isPlainObject(out[k])) out[k] = deepMerge(out[k], v);
    else out[k] = clone(v);
  }
  return out;
}

// ====================================================
// Validation + helpers
// ====================================================
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOCAL_NIC_RE = /^(\d{9}[VvXx]|\d{12})$/;

function isEmailKey(k) {
  // IMPORTANT: Avoid matching keys like "Emailed" (boolean flags) which contain
  // the substring "email" but are NOT email address fields.
  // Treat common email-address field names as email fields.
  // Examples we support: email, e-mail, emailAddress, email_address, *.email, *.emailAddress
  const key = String(k ?? "");
  return /(^|\.)((e-?mail)|(emailAddress)|(email_address))(|$)/i.test(key);
}
function isPhoneKey(k) {
  const key = String(k ?? "");
  // Match actual phone fields only. Fax should stay as plain text input
  // so values like 0112429199 are not auto-normalized to +94 ...
  // Avoid false positives like "telephoneBill".
  return /(^|\.)(telephone(Home|Office)?|tel(Home|Office)?|mobile|contact(No|Number)?|phone|employerContactNo)$/i.test(key);
}
function isAccountKey(k) {
  return /(account\s*no|accountNo|accountNumber|cds\s*.*number|cds\.number|iban)/i.test(k);
}
function isNicKey(k) {
  const full = String(k ?? "");
  const last = full.split(".").pop() || full;

  // Exclude NIC-related date fields
  if (
    /nic.*date/i.test(last) ||
    /date.*nic/i.test(last) ||
    /dateOfIssue/i.test(last) ||
    /issueDate/i.test(last)
  ) {
    return false;
  }

  // ✅ Only validate actual NIC fields (NOT idNo / idNumber)
  return /^(nic|nicNo|nicNumber|nicNum|nationalId|nationalID|nationalIdNumber|nationalIDNumber|nicOrPassport)$/i.test(
    last
  );
}

// Payment Instruction (Local Individual) uses idNo fields that may contain
// either a Sri Lankan NIC (old/new format) OR a CDS A/C number.
// We validate NIC ONLY when the value looks like a complete NIC.
function isPaymentInstructionIdNoKey(k) {
  const full = String(k ?? "");
  return /^paymentInstruction\.(principal|joint|witness)\.idNo$/i.test(full);
}

function looksLikeLocalNic(v) {
  // strip common separators (space, -, /, etc.) then uppercase
  const s = String(v ?? "")
    .trim()
    .replace(/[^0-9a-zA-Z]+/g, "")
    .toUpperCase();
  return /^\d{9}[VX]$/.test(s) || /^\d{12}$/.test(s);
}



function digitsOnly(v) {
  return String(v ?? "").replace(/\D+/g, "");
}

function normalizeDialCode(dialCode) {
  const s = String(dialCode || "").trim().replace(/\s+/g, "");
  if (!s) return "";
  return s.startsWith("+") ? s : `+${s}`;
}

const COUNTRY_BY_DIAL = Object.fromEntries(
  (rawCountries || [])
    .map((c) => [normalizeDialCode(c?.dial_code), String(c?.code || "").trim().toUpperCase()])
    .filter(([dial, iso]) => dial && iso)
);

function splitPhoneParts(v) {
  const raw = String(v ?? "").trim();
  if (!raw) return { dial: "", digits: "" };

  if (raw.startsWith("+")) {
    const parts = raw.split(/\s+/);
    const dial = normalizeDialCode(parts[0]);
    const digits = digitsOnly(parts.slice(1).join(""));
    return { dial, digits };
  }

  return { dial: "+94", digits: digitsOnly(raw) };
}

function validateEmail(v) {
  const s = String(v ?? "").trim();
  if (!s) return true;
  return EMAIL_RE.test(s);
}

function normalizeNic(v) {
  // Normalize NIC while typing:
  // users often paste NICs with separators like spaces, hyphens, slashes, etc.
  // We keep only letters/digits, then uppercase.
  const s = String(v ?? "").replace(/[^0-9a-zA-Z]+/g, "");
  if (!s) return "";
  return s.toUpperCase();
}

function validateLocalNic(v) {
  // Sri Lanka NIC validation
  // Accept the official *format*:
  // - Old NIC: 9 digits + V/X (e.g., 123456789V)
  // - New NIC: 12 digits      (e.g., 200012345678)
  //
  // We also attempt a day-of-year sanity check, but we treat it as a *soft* check.
  // (Some real-world inputs can be valid-format but fail strict ranges due to data-entry quirks.)
  // Normalize: remove spaces/hyphens/any separators and uppercase.
  // (Fixes false "Invalid NIC" errors when users paste NICs containing "/" or other separators.)
  const s = String(v ?? "")
    .trim()
    .replace(/[^0-9a-zA-Z]+/g, "")
    .toUpperCase();

  if (!s) return true;

  const isOld = /^\d{9}[VX]$/.test(s);
  const isNew = /^\d{12}$/.test(s);

  if (!isOld && !isNew) return false;

  // Soft checks (do NOT block)
  if (isOld) {
    const ddd = parseInt(s.slice(2, 5), 10);
    // expected: 001-366 (male) or 501-866 (female)
    // If out of range, still allow (format is correct).
    void ddd;
  }

  if (isNew) {
    const yyyy = parseInt(s.slice(0, 4), 10);
    const ddd = parseInt(s.slice(4, 7), 10);
    void yyyy;
    void ddd;
  }

  return true;
}

function normalizePhoneValue(v) {
  const raw = String(v ?? "").trim();
  if (!raw) return "";
  if (raw.startsWith("+")) {
    const parts = raw.split(/\s+/);
    const code = parts[0] || "";
    const number = digitsOnly(parts.slice(1).join(""));

    // Keep the selected dial code even when the user changes only the country first.
    // Example: selecting "+1" before typing digits should not bounce back to "+94".
    if (!code) return "";
    return number ? `${code} ${number}` : code;
  }
  // legacy: just digits
  const d = digitsOnly(raw);
  return d ? `+94 ${d}` : "";
}

function validatePhoneValue(v) {
  const raw = String(v ?? "").trim();
  if (!raw) return true;

  const norm = normalizePhoneValue(raw);
  if (!norm) return true;

  const { dial, digits } = splitPhoneParts(norm);

  // If the user selected only the country code and left the number blank,
  // treat it as empty here. Required-field validation is handled elsewhere.
  if (!digits) return true;

  const iso = COUNTRY_BY_DIAL[dial] || "";

  // First try validating the typed digits as a national number for the selected country.
  // This fixes valid numbers entered with the local leading zero, e.g. +94 and 0771234567.
  if (iso) {
    const nationalPhone = parsePhoneNumberFromString(digits, iso);
    if (nationalPhone?.isValid()) return true;
  }

  // Fallback to validating the full international number.
  const compact = `${dial}${digits}`.replace(/\s+/g, "");
  const phone = parsePhoneNumberFromString(compact);
  if (!phone) return false;

  return phone.isValid();
}

// ---- Credit Facility date/month validation helpers ----
function isIntInRange(v, min, max) {
  const s = String(v ?? "").trim();
  if (!s) return false;
  const n = Number(s);
  return Number.isInteger(n) && n >= min && n <= max;
}
function validateCFDay(v) {
  return isIntInRange(v, 1, 31);
}
function validateCFMonth(v) {
  return isIntInRange(v, 1, 12);
}
function normalize2Digits(v) {
  return digitsOnly(String(v ?? "")).slice(0, 2);
}

function walkObject(obj, basePath = "") {
  const out = [];
  const stack = [{ val: obj, path: basePath }];
  while (stack.length) {
    const { val, path } = stack.pop();
    if (val && typeof val === "object" && !Array.isArray(val)) {
      for (const [k, v] of Object.entries(val)) {
        const p = path ? `${path}.${k}` : k;
        if (v && typeof v === "object" && !Array.isArray(v)) stack.push({ val: v, path: p });
        else out.push({ key: k, path: p, value: v });
      }
    }
  }
  return out;
}

function getPrincipalProfile(nextForm, region, type) {
  // Individual
  if (region === "local" && type === "individual") {
    const p = nextForm?.clientRegistration?.principal || {};
    const fullName = [p.title, p.namesByInitials || p.initials, p.surname].filter(Boolean).join(" ").trim();
    return { name: fullName, nic: p.nic, dob: p.dateOfBirth || p.dob };
  }
  if (region === "foreign" && type === "individual") {
    const p = nextForm?.fiClientRegistration?.principal || nextForm?.clientRegistration?.principal || {};
    const fullName = [p.title, p.fullName || p.name, p.surname].filter(Boolean).join(" ").trim();
    return { name: fullName, nic: p.passportNo || p.nic, dob: p.dateOfBirth || p.dob };
  }
  // Corporate
  if (type === "corporate") {
    const c = nextForm?.clientRegistration || nextForm?.fcClientRegistration || {};
    const name = c.companyName || c.nameOfCompany || "";
    const reg = c.regNo || c.businessRegNo || "";
    return { companyName: String(name).trim(), regNo: String(reg).trim() };
  }
  return {};
}

function applyAutofill(nextForm, region, type) {
  const prof = getPrincipalProfile(nextForm, region, type);

  // Local Individual: Direction Online "Client Name" should NOT include the title (e.g., "Ms").
  // If only the title exists, keep the field empty until real name parts are present.
  let directionOnlineClientName = prof.name;
  if (region === "local" && type === "individual") {
    const p = nextForm?.clientRegistration?.principal || {};
    const noTitle = [p.namesByInitials || p.initials, p.surname].filter(Boolean).join(" ").trim();
    directionOnlineClientName = noTitle;
  }

  const fillIfEmpty = (path, value) => {
    if (value === undefined || value === null) return;
    const cur = getByPath(nextForm, path);
    if (cur === undefined || cur === null || String(cur).trim() === "") setByPath(nextForm, path, value);
  };

  // Individual: copy name / NIC into other steps if present
  if (prof.name) {
    // fillIfEmpty("creditFacility.client.name", prof.name);
    // if (directionOnlineClientName) fillIfEmpty("directionOnline.clientName", directionOnlineClientName);
    // fillIfEmpty("directionOnline.iWe.name", prof.name);
  }
  if (prof.nic) {
    // fillIfEmpty("creditFacility.client.nicCds", prof.nic);
  }

  // Corporate: copy company name
  if (prof.companyName) {
    fillIfEmpty("creditFacility.client.name", prof.companyName);
  }

  // Corporate: copy Witness / Advisor details from Payment Instruction -> Credit Facility witness section
  // const piW = nextForm?.paymentInstruction?.witness || {};
  // if (piW?.name) fillIfEmpty("creditFacility.execution.witness1.name", piW.name);
  // if (piW?.idNo) fillIfEmpty("creditFacility.execution.witness1.nic", piW.idNo);

  // const cfW = nextForm?.creditFacility?.execution?.witness1 || {};
  // if (cfW?.name) fillIfEmpty("paymentInstruction.witness.name", cfW.name);
  // if (cfW?.nic) fillIfEmpty("paymentInstruction.witness.idNo", cfW.nic);

//   if (isLocalCorporate(region, type)) {
//   const cfW = nextForm?.creditFacility?.execution?.witness1 || {};

//   if (cfW?.name) fillIfEmpty("paymentInstruction.witness.name", cfW.name);
//   if (cfW?.nic)  fillIfEmpty("paymentInstruction.witness.idNo", cfW.nic);
// }


  

}

// Ensure all UI auto-filled/computed fields are **persisted** before submit/update,
// so the emailed PDF matches exactly what the user sees in the UI.
function materializeAutofillForSubmit(form, region, type) {
  const next = clone(form || {});

  // Run existing autofill rules (writes into `next` via setByPath)
  applyAutofill(next, region, type);

  // ---- Local -> Individual specific auto blocks (Joint CDS Instructions + Declaration I/We) ----
  if (region === "local" && type === "individual") {
    const cr = next?.clientRegistration || {};
    const principal = cr?.principal || {};
    const joint1 = cr?.jointApplicant || {};
    const joint2 = cr?.secondJointApplicant || {};
    const jci = cr?.jointCdsInstructions || {};

    const principalInitials = String(principal?.initials || principal?.namesByInitials || "").trim();
    const joint1Initials = joint1?.enabled ? String(joint1?.initials || joint1?.namesByInitials || "").trim() : "";
    const joint2Initials = joint2?.enabled ? String(joint2?.initials || joint2?.namesByInitials || "").trim() : "";
    const jointNames = [joint1Initials, joint2Initials].filter(Boolean).join(" / ");

    const today = new Date();
    const yyyy = String(today.getFullYear()).padStart(4, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const iso = `${yyyy}-${mm}-${dd}`;

    const preferFull = (existing, desired) => {
      const ex = String(existing ?? "").trim();
      const des = String(desired ?? "").trim();
      if (!des) return ex;
      if (!ex) return des;
      const looksLikeInitialsOnly = /^[A-Za-z](?:\s+[A-Za-z])*$/.test(ex);
      if (des.length > ex.length && (ex.length <= 3 || looksLikeInitialsOnly)) return des;
      return ex;
    };

    const fillIfEmptyOrShort = (path, value) => {
      if (value === undefined || value === null) return;
      const cur = getByPath(next, path);
      const nextVal = preferFull(cur, value);
      if (String(nextVal ?? "").trim() !== String(cur ?? "").trim()) {
        setByPath(next, path, nextVal);
      }
    };

    fillIfEmptyOrShort("clientRegistration.jointCdsInstructions.principalHolder", principalInitials);
    fillIfEmptyOrShort("clientRegistration.jointCdsInstructions.firstJointHolder", joint1Initials);
    fillIfEmptyOrShort("clientRegistration.jointCdsInstructions.secondJointHolder", joint2Initials);
    fillIfEmptyOrShort("clientRegistration.jointCdsInstructions.iName", principalInitials);
    fillIfEmptyOrShort("clientRegistration.jointCdsInstructions.authorizeJointName", jointNames);
    fillIfEmptyOrShort("clientRegistration.jointCdsInstructions.paymentsToName", principalInitials);
    fillIfEmptyOrShort("clientRegistration.jointCdsInstructions.date", iso);

    const fullName = String(
      principal?.namesByInitials || [principal?.initials, principal?.surname].filter(Boolean).join(" ")
    ).trim();

    fillIfEmptyOrShort("declaration.iWe.name", fullName);
    fillIfEmptyOrShort("declaration.iWe.nicNo", principal?.nic);
    fillIfEmptyOrShort("declaration.iWe.address", principal?.permanentAddress);
    fillIfEmptyOrShort("declaration.iWe.cds.prefix", principal?.cds?.prefix);
    fillIfEmptyOrShort("declaration.iWe.cds.number", principal?.cds?.number);

    // Also auto-fill all agreement-document parties (if those steps exist)
    const p1 = { name: fullName, nicNo: principal?.nic, address: principal?.permanentAddress };
    const p2 = joint1?.enabled
      ? {
          name: String([joint1?.title, joint1?.namesByInitials || joint1?.initials, joint1?.surnames].filter(Boolean).join(" ")).trim(),
          nicNo: joint1?.nic,
          address: joint1?.permanentAddress || joint1?.correspondenceAddress,
        }
      : { name: "", nicNo: "", address: "" };
    const p3 = joint2?.enabled
      ? {
          name: String([joint2?.title, joint2?.namesByInitials || joint2?.initials, joint2?.surnames].filter(Boolean).join(" ")).trim(),
          nicNo: joint2?.nic,
          address: joint2?.residentialAddress || joint2?.officeAddress,
        }
      : { name: "", nicNo: "", address: "" };

    ["clientAgreement", "creditFacility", "paymentInstruction", "directionOnline"].forEach((stepKey) => {
      const parties = getByPath(next, `${stepKey}.parties`);
      if (Array.isArray(parties)) {
        // fill party 0..2 only if empty
        const src = [p1, p2, p3];
        for (let i = 0; i < Math.min(parties.length, src.length); i++) {
          const base = parties[i] || {};
          const s = src[i] || {};
          parties[i] = {
            ...base,
            name: String(base.name || "").trim() ? base.name : s.name,
            nicNo: String(base.nicNo || "").trim() ? base.nicNo : s.nicNo,
            address: String(base.address || "").trim() ? base.address : s.address,
          };
        }
        setByPath(next, `${stepKey}.parties`, parties);
      }
    });
  }

  return next;
}

// Ensure the payload contains ONLY the steps that belong to the selected form.
// (Prevents emailed PDFs from showing extra steps from other wizards.)
function getAllowedStepKeysForFormKey(formKey) {
  switch (String(formKey || "")) {
    case "local_individual":
      return [
        "clientRegistration",
        "declaration",
        "clientAgreement",
        "creditFacility",
        "schedule1",
        "schedule2",
        "paymentInstruction",
        "directionOnline",
      ];
    case "local_corporate":
      return ["clientRegistration"]; // new single form
    case "foreign_individual":
      return ["fiClientRegistration"];
    case "foreign_corporate":
      return ["fcClientRegistration"];
    default:
      return [];
  }
}

function pruneFormDataForFormKey(formKey, formData) {
  const allowed = new Set(getAllowedStepKeysForFormKey(formKey));
  const src = formData && typeof formData === "object" ? formData : {};
  const out = {};
  for (const k of Object.keys(src)) {
    if (allowed.has(k)) out[k] = src[k];
  }
  return out;
}

function getByPath(root, path) {
  try {
    const parts = String(path || "").split(".");
    let cur = root;
    for (const part of parts) {
      if (cur == null) return undefined;
      const m = part.match(/^(.+?)\[(\d+)\]$/);
      if (m) {
        const key = m[1];
        const idx = Number(m[2]);
        cur = cur?.[key];
        if (!Array.isArray(cur)) return undefined;
        cur = cur[idx];
      } else {
        cur = cur?.[part];
      }
    }
    return cur;
  } catch {
    return undefined;
  }
}

function setByPath(root, path, value) {
  // Supports array indices like: "creditFacility.parties.0.name"
  const parts = path.split(".");
  let cur = root;

  for (let i = 0; i < parts.length - 1; i++) {
    const raw = parts[i];
    const isIndex = raw !== "" && !Number.isNaN(Number(raw));
    const key = isIndex ? Number(raw) : raw;

    const nextRaw = parts[i + 1];
    const nextIsIndex = nextRaw !== "" && !Number.isNaN(Number(nextRaw));

    if (cur[key] == null || typeof cur[key] !== "object") {
      cur[key] = nextIsIndex ? [] : {};
    }

    cur = cur[key];
  }

  const lastRaw = parts[parts.length - 1];
  const lastIsIndex = lastRaw !== "" && !Number.isNaN(Number(lastRaw));
  const lastKey = lastIsIndex ? Number(lastRaw) : lastRaw;
  cur[lastKey] = value;
}


const SOURCE_FUNDS_ITEMS = [
  ["salaryProfitIncome","Salary / Profit Income"],
  ["investmentProceedsSavings","Investment Proceeds / Savings"],
  ["salesBusinessTurnover","Sales and Business Turnover"],
  ["contractProceeds","Contract Proceeds"],
  ["salesOfPropertyAssets","Sales of Property/Assets"],
  ["gifts","Gifts"],
  ["donationsCharities","Donations / Charities (Local / Foreign)"],
  ["commissionIncome","Commission Income"],
  ["familyRemittance","Family Remittance"],
  ["exportProceeds","Export proceeds"],
  ["membershipContribution","Membership contribution"],
  ["others","Others (Specify)"],
];

function SourceFundsCard({ holderKey, label, enabled, form, update }) {
  const base = `clientRegistration.kycProfile.sourceOfFunds.${holderKey}`;

  return (
    <div className={`rounded-2xl border border-zinc-200 bg-white/60 p-4 dark:border-zinc-800 dark:bg-zinc-950/25 ${!enabled ? "opacity-50" : ""}`}>
      <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{label}</div>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {SOURCE_FUNDS_ITEMS.map(([k, lab]) => (
          <label key={k} className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-300">
            <input
              type="checkbox"
              disabled={!enabled}
              checked={!!getByPath(form, `${base}.${k}`)}
              onChange={(e) => update(`${base}.${k}`, e.target.checked)}
              className={`h-4 w-4 rounded border-zinc-400 accent-zinc-900 dark:border-zinc-600 dark:accent-white ${!enabled ? "opacity-40" : ""}`}
            />
            <span>{lab}</span>
          </label>
        ))}
      </div>

      <div className="mt-3">
        <Field label="If Others, specify">
          <Input
            value={getByPath(form, `${base}.othersSpecify`) || ""}
            onChange={(e) => update(`${base}.othersSpecify`, e.target.value)}
            disabled={!enabled || !getByPath(form, `${base}.others`)}
            placeholder="Specify other source of funds"
          />
        </Field>
      </div>
    </div>
  );
}

function PepQuestion({ base, enabled, qLabel, yesNoKey, explainKey, explainPlaceholder, form, update }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white/60 p-4 dark:border-zinc-800 dark:bg-zinc-950/25">
      <div className="text-sm text-zinc-700 dark:text-zinc-300">{qLabel}</div>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Answer">
          <Select
            value={getByPath(form, `${base}.${yesNoKey}`) || ""}
            onChange={(e) => update(`${base}.${yesNoKey}`, e.target.value)}
            disabled={!enabled}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </Select>
        </Field>
        <Field label="If Yes, please explain">
          <Input
            value={getByPath(form, `${base}.${explainKey}`) || ""}
            onChange={(e) => update(`${base}.${explainKey}`, e.target.value)}
            disabled={!enabled || String(getByPath(form, `${base}.${yesNoKey}`) || "") !== "Yes"}
            placeholder={explainPlaceholder}
          />
        </Field>
      </div>
    </div>
  );
}

function PepBlockCard({ holderKey, label, enabled, form, update }) {
  const base = `clientRegistration.kycProfile.pep.${holderKey}`;

  return (
    <div className={`${!enabled ? "opacity-50" : ""}`}>
      <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{label}</div>
      <div className="mt-3 grid grid-cols-1 gap-3">
        <PepQuestion
          base={base}
          enabled={enabled}
          form={form}
          update={update}
          qLabel="Are you individuals who are or have been entrusted domestically by a with prominent public functions? For example, Heads of State or of government, senior politicians, senior government, judicial or military officials, senior executives of state owned corporations, important political party officials. If “Yes” please explain. "
          yesNoKey="domesticPublicFunction"
          explainKey="domesticExplain"
          explainPlaceholder="Explain"
        />
        <PepQuestion
          base={base}
          enabled={enabled}
          form={form}
          update={update}
          qLabel="Are you individuals who are or have been entrusted with prominent public functions by a foreign country? For example, Heads of State or of government, senior politicians, senior government, judicial or military officials, senior executives of state owned corporations, important political party officials. If “Yes” please explain the relationship "
          yesNoKey="foreignPublicFunction"
          explainKey="foreignExplain"
          explainPlaceholder="Explain relationship"
        />
        <PepQuestion
          base={base}
          enabled={enabled}
          form={form}
          update={update}
          qLabel="Are you individuals who are related to a PEP either directly (consanguinity) or through marriage or similar (civil) forms of partnership? If “Yes” please explain the relationship "
          yesNoKey="relatedToPep"
          explainKey="relatedExplain"
          explainPlaceholder="Explain relationship"
        />
        <PepQuestion
          base={base}
          enabled={enabled}
          form={form}
          update={update}
          qLabel="Are you individuals who are closely connected to a PEP, either socially or professionally? If “Yes” please explain the relationship "
          yesNoKey="closelyConnected"
          explainKey="closelyExplain"
          explainPlaceholder="Explain relationship"
        />
      </div>
    </div>
  );
}


export default function Wizard() {
  const { region, type } = useParams();
  const nav = useNavigate();
  const loc = useLocation();
  const { theme } = useTheme();
  const search = loc?.search || "";
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);
  const editId = searchParams.get("edit");
  const isEditing = Boolean(editId);


  
const isFormRoute =
  isLocalIndividual(region, type) ||
  isLocalCorporate(region, type) ||
  isForeignIndividual(region, type) ||
  isForeignCorporate(region, type);

const pageBgStyle = isFormRoute
  ? {
      backgroundImage: `url(${theme === "dark" ? formBg : formBgLight})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }
  : undefined;

const steps = useMemo(
    () => {
      if (isLocalIndividual(region, type)) return localIndividualSteps;
      if (isLocalCorporate(region, type)) return localCorporateSteps;
      if (isForeignIndividual(region, type)) return foreignIndividualSteps;
      if (isForeignCorporate(region, type)) return foreignCorporateSteps;
      return [];
    },
    [region, type]
  );
  const empty = useMemo(
    () => {
      if (isLocalIndividual(region, type)) return localIndividualEmpty;
      if (isLocalCorporate(region, type)) return localCorporateEmpty;
      if (isForeignIndividual(region, type)) return foreignIndividualEmpty;
      if (isForeignCorporate(region, type)) return foreignCorporateEmpty;
      return {};
    },
    [region, type]
  );
  const initial = useMemo(() => {
  const draft = loadDraft(region, type);
  // Always start from `empty` so missing nested keys never break typing.
  return draft ? deepMerge(empty, draft) : clone(empty);
}, [region, type, empty]);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // ✅ If opened with ?edit=<id>, load submitted application from server for editing
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!isEditing) return;
      try {
        setBusy(true);
        setError("");
        const payload = await fetchApplicationForEdit({ id: editId });
        if (!alive) return;

        // Safety: ensure route matches the loaded application
        if (
          String(payload?.region || "") !== String(region || "") ||
          String(payload?.applicantType || "") !== String(type || "")
        ) {
          setError("This edit link does not match the selected application flow.");
          return;
        }

        // Map server-side uploaded files so we can allow skipping re-upload while editing
        const filesArr = Array.isArray(payload?.files) ? payload.files : [];
        const existingMap = {};
        for (const f of filesArr) {
          if (f?.field) existingMap[f.field] = f;
        }
        setExistingFiles(existingMap);

        setForm(payload?.formData || initial);
        setStep(1);
      } catch (e) {
        if (!alive) return;
        setError(e?.message || "Failed to load application for editing");
      } finally {
        if (alive) setBusy(false);
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, editId, region, type]);

  const formScrollRef = useRef(null);
  const saveTimerRef = useRef(null);
  const toastTimerRef = useRef(null);
  const prevFlowRef = useRef({ region, type });
  const [toast, setToast] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewMarkup, setPreviewMarkup] = useState("");
  const previewScrollRef = useRef(null);

  const showToast = (message) => {
    const msg = String(message || "").trim();
    if (!msg) return;
    setToast(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 3500);
  };

  const scrollFormTop = (smooth = true) => {
    const el = formScrollRef.current;
    if (!el) return;
    try {
      el.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
    } catch {
      el.scrollTop = 0;
    }
  };
  useEffect(() => {
    if (error) {
      showToast(error);
      scrollFormTop(true);
    }
  }, [error]);

  const previewErrorEntries = useMemo(() => {
    return Object.entries(fieldErrors || {}).map(([path, message]) => ({
      path,
      message: String(message || "Please review this field."),
    }));
  }, [fieldErrors]);

  useEffect(() => {
    if (!previewOpen) return;
    if (!error && !previewErrorEntries.length) return;
    const el = previewScrollRef.current;
    if (!el) return;
    try {
      el.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      el.scrollTop = 0;
    }
  }, [previewOpen, error, previewErrorEntries]);

  const jumpToField = (targetPath) => {
    if (!targetPath) return;
    if (previewOpen) setPreviewOpen(false);
    const root = formScrollRef.current;
    if (!root) return;
    const allCandidates = Array.from(root.querySelectorAll("[data-path], [name]"));
    const target = allCandidates.find((node) => {
      const dataPath = node.getAttribute?.("data-path");
      const name = node.getAttribute?.("name");
      return dataPath === targetPath || name === targetPath;
    });
    if (!target) return;
    try {
      target.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    } catch {}
    const focusable = target.matches?.("input, select, textarea, button")
      ? target
      : target.querySelector?.("input, select, textarea, button");
    try {
      focusable?.focus?.({ preventScroll: true });
    } catch {
      try { focusable?.focus?.(); } catch {}
    }
    target.classList?.add?.("smartportal-error-pulse");
    setTimeout(() => target.classList?.remove?.("smartportal-error-pulse"), 1800);
  };

  useEffect(() => {
    const entries = Object.entries(fieldErrors || {});
    if (!entries.length) return;

    const [firstPath] = entries[0];
    if (!firstPath) return;

    const root = formScrollRef.current;
    if (!root) return;
    const allCandidates = Array.from(root.querySelectorAll("[data-path], [name]"));
    const target = allCandidates.find((node) => {
      const dataPath = node.getAttribute?.("data-path");
      const name = node.getAttribute?.("name");
      return dataPath === firstPath || name === firstPath;
    });
    if (!target) return;

    try {
      target.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    } catch {}

    const focusable = target.matches?.("input, select, textarea, button")
      ? target
      : target.querySelector?.("input, select, textarea, button");

    try {
      focusable?.focus?.({ preventScroll: true });
    } catch {
      try { focusable?.focus?.(); } catch {}
    }

    target.classList?.add?.("smartportal-error-pulse");
    const timer = setTimeout(() => target.classList?.remove?.("smartportal-error-pulse"), 1800);
    return () => clearTimeout(timer);
  }, [fieldErrors]);





  // uploads (clientRegistration)
  // existing uploaded files (when editing) so we don't force re-upload
  const [existingFiles, setExistingFiles] = useState({});
  const hasExisting = (field) => !!existingFiles?.[field];

  const [bankProof, setBankProof] = useState(null);
  const [principalSig, setPrincipalSig] = useState(null);
  const [jointSig, setJointSig] = useState(null);
  const [clientSig, setClientSig] = useState(null);
  const [advisorSig, setAdvisorSig] = useState(null);
  const [principalSignaturePreviewUrl, setPrincipalSignaturePreviewUrl] = useState("");
  const [jointSignaturePreviewUrl, setJointSignaturePreviewUrl] = useState("");
  const [secondJointSig, setSecondJointSig] = useState(null);
  const [secondJointSignaturePreviewUrl, setSecondJointSignaturePreviewUrl] = useState("");
  const [clientSignaturePreviewUrl, setClientSignaturePreviewUrl] = useState("");
  const [advisorSignaturePreviewUrl, setAdvisorSignaturePreviewUrl] = useState("");
  const [authorizerSignaturePreviewUrl, setAuthorizerSignaturePreviewUrl] = useState("");
  const [witness1SignaturePreviewUrl, setWitness1SignaturePreviewUrl] = useState("");
  const [witness2SignaturePreviewUrl, setWitness2SignaturePreviewUrl] = useState("");
  const [witness1SignaturePreviewUrl, setWitness1SignaturePreviewUrl] = useState("");
  const [witness2SignaturePreviewUrl, setWitness2SignaturePreviewUrl] = useState("");
  // Local Individual (Client Registration) uploads

  const resolveExistingUploadPreviewUrl = (field) => {
    const entry = existingFiles?.[field];
    return entry?.url || entry?.path || "";
  };

  useEffect(() => {
    if (principalSig && typeof principalSig !== "string" && String(principalSig.type || "").startsWith("image/")) {
      const url = URL.createObjectURL(principalSig);
      setPrincipalSignaturePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }

    setPrincipalSignaturePreviewUrl(resolveExistingUploadPreviewUrl("principalSig"));
  }, [principalSig, existingFiles]);

  useEffect(() => {
    if (jointSig && typeof jointSig !== "string" && String(jointSig.type || "").startsWith("image/")) {
      const url = URL.createObjectURL(jointSig);
      setJointSignaturePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }

    setJointSignaturePreviewUrl(resolveExistingUploadPreviewUrl("jointSig"));
  }, [jointSig, existingFiles]);

  useEffect(() => {
    if (secondJointSig && typeof secondJointSig !== "string" && String(secondJointSig.type || "").startsWith("image/")) {
      const url = URL.createObjectURL(secondJointSig);
      setSecondJointSignaturePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }

    setSecondJointSignaturePreviewUrl(resolveExistingUploadPreviewUrl("secondJointSig"));
  }, [secondJointSig, existingFiles]);

  useEffect(() => {
    if (clientSig && typeof clientSig !== "string" && String(clientSig.type || "").startsWith("image/")) {
      const url = URL.createObjectURL(clientSig);
      setClientSignaturePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }

    setClientSignaturePreviewUrl(resolveExistingUploadPreviewUrl("clientSig"));
  }, [clientSig, existingFiles]);

  useEffect(() => {
    if (advisorSig && typeof advisorSig !== "string" && String(advisorSig.type || "").startsWith("image/")) {
      const url = URL.createObjectURL(advisorSig);
      setAdvisorSignaturePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }

    setAdvisorSignaturePreviewUrl(resolveExistingUploadPreviewUrl("advisorSig"));
  }, [advisorSig, existingFiles]);

  const [liPrincipalIdFront, setLiPrincipalIdFront] = useState(null);
  const [liPrincipalIdBack, setLiPrincipalIdBack] = useState(null);
  const [liPrincipalUtilityBill, setLiPrincipalUtilityBill] = useState(null);

  const [liJointIdFront, setLiJointIdFront] = useState(null);
  const [liJointIdBack, setLiJointIdBack] = useState(null);

  const [liSecondJointIdFront, setLiSecondJointIdFront] = useState(null);
  const [liSecondJointIdBack, setLiSecondJointIdBack] = useState(null);

  const [liDiscretionaryLetter, setLiDiscretionaryLetter] = useState(null);
  const [liAgentSignature, setLiAgentSignature] = useState(null);
  const [liOfficeAdvisorSignature, setLiOfficeAdvisorSignature] = useState(null);

  useEffect(() => {
    if (liAgentSignature && typeof liAgentSignature !== "string" && String(liAgentSignature.type || "").startsWith("image/")) {
      const url = URL.createObjectURL(liAgentSignature);
      setAuthorizerSignaturePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }

    setAuthorizerSignaturePreviewUrl(resolveExistingUploadPreviewUrl("liAgentSignature"));
  }, [liAgentSignature, existingFiles]);
  const [agreementFirmSig, setAgreementFirmSig] = useState(null);
  const [agreementWitness1Sig, setAgreementWitness1Sig] = useState(null);
  const [agreementWitness2Sig, setAgreementWitness2Sig] = useState(null);

  useEffect(() => {
    if (agreementWitness1Sig && typeof agreementWitness1Sig !== "string" && String(agreementWitness1Sig.type || "").startsWith("image/")) {
      const url = URL.createObjectURL(agreementWitness1Sig);
      setWitness1SignaturePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }

    setWitness1SignaturePreviewUrl(resolveExistingUploadPreviewUrl("agreementWitness1Sig"));
  }, [agreementWitness1Sig, existingFiles]);

  useEffect(() => {
    if (agreementWitness2Sig && typeof agreementWitness2Sig !== "string" && String(agreementWitness2Sig.type || "").startsWith("image/")) {
      const url = URL.createObjectURL(agreementWitness2Sig);
      setWitness2SignaturePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }

    setWitness2SignaturePreviewUrl(resolveExistingUploadPreviewUrl("agreementWitness2Sig"));
  }, [agreementWitness2Sig, existingFiles]);
  const [cfPrincipalSig, setCfPrincipalSig] = useState(null);
  const [cfFirmSig, setCfFirmSig] = useState(null);
  const [cfWitness1Sig, setCfWitness1Sig] = useState(null);
  const [cfWitness2Sig, setCfWitness2Sig] = useState(null);
  const [piJointSig, setPiJointSig] = useState(null);
  const [piWitnessSig, setPiWitnessSig] = useState(null);
  // Payment Instruction uploads (local corporate)
  const [lcPiPrincipalSig, setLcPiPrincipalSig] = useState(null);
  const [lcPiJointSig, setLcPiJointSig] = useState(null);
  const [lcPiWitnessSig, setLcPiWitnessSig] = useState(null);

  const [lcDirector1Sig, setLcDirector1Sig] = useState(null);
  const [lcDirector2Sig, setLcDirector2Sig] = useState(null);
  const [lcCompanySeal, setLcCompanySeal] = useState(null);

  // Local Corporate (NEW form) uploads
  const [lcBankStatement, setLcBankStatement] = useState(null);
  const [lcBoardResolution, setLcBoardResolution] = useState(null);
  const [lcMemorandumArticles, setLcMemorandumArticles] = useState(null);
  const [lcIncorporationCertificate, setLcIncorporationCertificate] = useState(null);
  const [lcAgentSignature, setLcAgentSignature] = useState(null);
  const [lcAuthorizerSignature, setLcAuthorizerSignature] = useState(null);
  const [lcStockbrokerFirmSignature, setLcStockbrokerFirmSignature] = useState(null);
  const [lcWitness1Signature, setLcWitness1Signature] = useState(null);
  const [lcWitness2Signature, setLcWitness2Signature] = useState(null);
  const [lcPrincipalApplicantSignature, setLcPrincipalApplicantSignature] = useState(null);
  const [lcJointApplicantSignature, setLcJointApplicantSignature] = useState(null);


  // Auto-sync Client Agreement witnesses -> Credit Facility witnesses
  useEffect(() => {
    setCfWitness1Sig(agreementWitness1Sig || null);
  }, [agreementWitness1Sig]);

  useEffect(() => {
    setCfWitness2Sig(agreementWitness2Sig || null);
  }, [agreementWitness2Sig]);


  // Auto-sync Payment Instruction witness/advisor signature -> Credit Facility witness signature (local corporate)
  useEffect(() => {
    if (isLocalCorporate(region, type) && lcPiWitnessSig && !cfWitness1Sig) {
      setCfWitness1Sig(lcPiWitnessSig);
    }
  }, [lcPiWitnessSig, region, type]);

  useEffect(() => {
    if (isLocalCorporate(region, type) && cfWitness1Sig && !lcPiWitnessSig) {
      setLcPiWitnessSig(cfWitness1Sig);
    }
  }, [cfWitness1Sig, region, type]);



    // uploads (local corporate)
  const [corpRegCert, setCorpRegCert] = useState(null);
  const [kycDocs, setKycDocs] = useState(null);
  const [boDocs, setBoDocs] = useState(null);
  // foreign corporate - beneficial ownership uploads
  const [fcBoAuthorizedPersonSig, setFcBoAuthorizedPersonSig] = useState(null);
  const [fcBoAfiSignatureSeal, setFcBoAfiSignatureSeal] = useState(null);
  const [boFiSeal, setBoFiSeal] = useState(null);
  const [additionalDocs, setAdditionalDocs] = useState(null);

  // uploads (foreign corporate)
const [fcDir1Sig, setFcDir1Sig] = useState(null);
const [fcDir2Sig, setFcDir2Sig] = useState(null);
const [fcCompanySeal, setFcCompanySeal] = useState(null);
const [fcBankStatement, setFcBankStatement] = useState(null);
const [fcBoardResolution, setFcBoardResolution] = useState(null);
const [fcMemorandumArticles, setFcMemorandumArticles] = useState(null);
const [fcIncorporationCertificate, setFcIncorporationCertificate] = useState(null);

// uploads (foreign corporate - KYC)
const [fcKycAuthorizedSignatorySig, setFcKycAuthorizedSignatorySig] = useState(null);
const [fcKycCertifyingOfficerSig, setFcKycCertifyingOfficerSig] = useState(null);
const [fcKycInvestmentAdvisorSig, setFcKycInvestmentAdvisorSig] = useState(null);


const [fcFinalDir1Sig, setFcFinalDir1Sig] = useState(null);
const [fcFinalDir2Sig, setFcFinalDir2Sig] = useState(null);
const [fcFinalCompanySeal, setFcFinalCompanySeal] = useState(null);
const [fcCertOfficerSig, setFcCertOfficerSig] = useState(null);

// uploads (declaration)
  const [showClientAgreementModal, setShowClientAgreementModal] = useState(false);
  // Clear all upload states when switching application flow (e.g., Local -> Foreign)
  // so previously-selected files/signatures don't persist in memory.
  const resetUploads = () => {
    setBankProof(null);
    setPrincipalSig(null);
    setJointSig(null);
    setSecondJointSig(null);

    setAgreementFirmSig(null);
    setAgreementWitness1Sig(null);
    setAgreementWitness2Sig(null);

    setCfPrincipalSig(null);
    setCfFirmSig(null);
    setCfWitness1Sig(null);
    setCfWitness2Sig(null);

    setPiJointSig(null);
    setPiWitnessSig(null);

    setLcPiPrincipalSig(null);
    setLcPiJointSig(null);
    setLcPiWitnessSig(null);

    setLcDirector1Sig(null);
    setLcDirector2Sig(null);
    setLcCompanySeal(null);

    setCorpRegCert(null);
    setKycDocs(null);
    setBoDocs(null);

    setFcBoAuthorizedPersonSig(null);
    setFcBoAfiSignatureSeal(null);
    setBoFiSeal(null);
    setAdditionalDocs(null);

    setFcDir1Sig(null);
    setFcDir2Sig(null);
    setFcCompanySeal(null);
    setFcBankStatement(null);
    setFcBoardResolution(null);
    setFcMemorandumArticles(null);
    setFcIncorporationCertificate(null);

    setFcKycAuthorizedSignatorySig(null);
    setFcKycCertifyingOfficerSig(null);
    setFcKycInvestmentAdvisorSig(null);

    setFcFinalDir1Sig(null);
    setFcFinalDir2Sig(null);
    setFcFinalCompanySeal(null);
    setFcCertOfficerSig(null);

    setClientSig(null);
    setAdvisorSig(null);
  };

  // When user switches application flow (route changes like /apply/local/individual -> /apply/foreign/individual),
  // ensure we start fresh and do NOT keep the previous form's in-memory data.
  useEffect(() => {
    if (isEditing) return;

    const prev = prevFlowRef.current;
    if (prev?.region && prev?.type && (prev.region !== region || prev.type !== type)) {
      // Wipe the previous flow's draft so if user goes back, they don't see old values.
      clearDraft(prev.region, prev.type);
    }

    // Also wipe ALL other flow drafts (except the current one).
    // This prevents a common user mistake:
    // starting the wrong form, switching to the correct form, and later seeing old values again.
    const flows = [
      { region: "local", type: "individual" },
      { region: "local", type: "corporate" },
      { region: "foreign", type: "individual" },
      { region: "foreign", type: "corporate" },
    ];
    flows.forEach((f) => {
      if (String(f.region) === String(region) && String(f.type) === String(type)) return;
      clearDraft(f.region, f.type);
    });

    prevFlowRef.current = { region, type };

    setStep(1);
    setForm(initial);
    setError("");
    resetUploads();
    scrollFormTop(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region, type, isEditing, initial]);


  const total = steps.length;
  const currentKey = steps[step - 1]?.key;
  const pct = total ? Math.round((step / total) * 100) : 0;

  // ✅ Updated (Requested): Local → Individual should NOT show Steps + progress bar.
  const hideStepUI = isLocalIndividual(region, type) || isLocalCorporate(region, type) || isForeignIndividual(region, type) || isForeignCorporate(region, type);

  // ----------------------------------------------------
  // Local -> Corporate: Auto-fill Payment Instruction witness/advisor
  // from Agreement - Credit Facility (witness section)
  // ----------------------------------------------------
  useEffect(() => {
    if (!isLocalCorporate(region, type)) return;
    if (currentKey !== "paymentInstruction") return;

    const w1 = form?.creditFacility?.execution?.witness1 || {};
    const srcName = String(w1?.name || "").trim();
    const srcNic = String(w1?.nic || "").trim();

    const dstName = String(form?.paymentInstruction?.witness?.name || "").trim();
    const dstId = String(form?.paymentInstruction?.witness?.idNo || "").trim();

    // Copy only when there's a source value and destination is empty or different
    if (srcName && dstName !== srcName) update("paymentInstruction.witness.name", srcName);
    if (srcNic && dstId !== srcNic) update("paymentInstruction.witness.idNo", srcNic);
  }, [region, type, currentKey, form?.creditFacility?.execution?.witness1?.name, form?.creditFacility?.execution?.witness1?.nic]);

  const update = (path, value) => {
    const p = String(path || "");
    let v = value;

    // Normalize inputs + friendly inline validation toasts
    if (isPhoneKey(p)) {
      const before = String(v ?? "");
      const norm = normalizePhoneValue(before);
      // If user typed letters/symbols into number, show a hint
      if (before && norm && digitsOnly(before) !== digitsOnly(norm)) {
        showToast("Phone numbers can contain digits only.");
      }
      v = norm;
    }

    if (isAccountKey(p)) {
      const before = String(v ?? "");
      const d = digitsOnly(before);
      if (before && d !== before.replace(/\s+/g, "")) {
        showToast("Invalid Account number.");
      }
      v = d;
    }

    // NIC: normalize spacing/hyphens and uppercase while typing
    // - Local Individual: no popup/toast while typing; validate on "Next".
    // - Other local flows: show a toast once it looks complete and the *format* is wrong.
    if (region === "local" && isNicKey(p)) {
      v = normalizeNic(v);
      const s = String(v || "").trim();
      if (type !== "individual") {
        if (s && (s.length === 10 || s.length === 12) && !LOCAL_NIC_RE.test(s)) {
          showToast("Invalid NIC.");
        }
      }
    }

    // Local Individual -> Payment Instruction: idNo can be NIC or CDS.
    // Validate NIC only when the user typed a full NIC pattern.
    if (region === "local" && isPaymentInstructionIdNoKey(p)) {
      const norm = normalizeNic(v);
      if (type !== "individual" && looksLikeLocalNic(norm) && !validateLocalNic(norm)) {
        showToast("Invalid NIC.");
      }
      // Store normalized NIC format when it looks like NIC, otherwise keep as-is (CDS, etc.)
      v = looksLikeLocalNic(norm) ? norm : v;
    }

    if (isEmailKey(p)) {
      const s = String(v ?? "").trim();
      if (s && !validateEmail(s)) {
      // No toast pop-up: we still keep the value, and step validation can handle errors.
    }
    }

    // Credit Facility: allow only 1-2 digits for Date/Month fields
    if (
      p === "creditFacility.date.day" ||
      p === "creditFacility.date.month" ||
      p === "creditFacility.execution.date" ||
      p === "creditFacility.execution.month"
    ) {
      const before = String(v ?? "");
      const norm = normalize2Digits(before);
      if (before && norm !== before) showToast("Use numbers only.");
      v = norm;
    }


    // Date inputs (YYYY-MM-DD): some users type the year manually and may enter more than 4 digits.
    // Keep the calendar picker behavior, but clamp the YEAR portion to 4 digits when a date-like string is typed.
    if (/(^|\.)date$/i.test(p) || /date|dob|birth|expiry|issued|issue/i.test(p)) {
      const s = String(v ?? "");
      // Handle <input type="date" /> value like "YYYY-MM-DD"
      if (/^\d{4,}-\d{2}-\d{2}$/.test(s)) {
        const parts = s.split("-");
        parts[0] = parts[0].slice(0, 4);
        v = parts.join("-");
        // Store dates in DD/MM/YYYY format across all forms
        v = isoToDmy(v);
      }
      // Handle "DD/MM/YYYY" typed values (if any)
      if (/^\d{1,2}\/\d{1,2}\/\d{4,}$/.test(s)) {
        const parts = s.split("/");
        parts[2] = parts[2].slice(0, 4);
        v = parts.join("/");
      }
    }


    // Date fields: if user types the year manually, keep it to 4 digits (still allows calendar pickers)
    if (/(^|\.)year$/i.test(p)) {
      v = digitsOnly(String(v ?? "")).slice(0, 4);
    }
    const next = clone(form || {});
    setByPath(next, path, v);

    // Autofill repeated fields across steps (when empty)
    applyAutofill(next, region, type);

    setForm(next);

    if (p) {
      setFieldErrors((prev) => {
        if (!prev || !prev[p]) return prev;
        const nextErrors = { ...prev };
        delete nextErrors[p];
        return nextErrors;
      });
      if (fieldErrors?.[p]) setError("");
    }

    // Auto-save (debounced)
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveDraft(region, type, next);
    }, 350);
  };

  // ✅ Ensure Local Individual auto-filled fields are persisted so the PDF/email includes them
  useEffect(() => {
    if (!(region === "local" && type === "individual")) return;

    const cr = form?.clientRegistration || {};
    const principal = cr?.principal || {};
    const joint1 = cr?.jointApplicant || {};
    const joint2 = cr?.secondJointApplicant || {};
    const jci = cr?.jointCdsInstructions || {};
    const decl = form?.declaration || {};

    const principalInitials = String(principal?.initials || principal?.namesByInitials || "").trim();
    const joint1Initials = joint1?.enabled ? String(joint1?.initials || joint1?.namesByInitials || "").trim() : "";
    const joint2Initials = joint2?.enabled ? String(joint2?.initials || joint2?.namesByInitials || "").trim() : "";
    const jointNames = [joint1Initials, joint2Initials].filter(Boolean).join(" / ");

    const today = new Date();
    const yyyy = String(today.getFullYear()).padStart(4, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const iso = `${yyyy}-${mm}-${dd}`;

    // Joint CDS Instructions (fill only when empty so user edits remain)
    if (!String(jci?.principalHolder || "").trim() && principalInitials) update("clientRegistration.jointCdsInstructions.principalHolder", principalInitials);
    if (!String(jci?.firstJointHolder || "").trim() && joint1Initials) update("clientRegistration.jointCdsInstructions.firstJointHolder", joint1Initials);
    if (!String(jci?.secondJointHolder || "").trim() && joint2Initials) update("clientRegistration.jointCdsInstructions.secondJointHolder", joint2Initials);
    if (!String(jci?.iName || "").trim() && principalInitials) update("clientRegistration.jointCdsInstructions.iName", principalInitials);
    if (!String(jci?.authorizeJointName || "").trim() && jointNames) update("clientRegistration.jointCdsInstructions.authorizeJointName", jointNames);
    if (!String(jci?.paymentsToName || "").trim() && principalInitials) update("clientRegistration.jointCdsInstructions.paymentsToName", principalInitials);
    if (!String(jci?.date || "").trim()) update("clientRegistration.jointCdsInstructions.date", iso);

    // Declaration -> I/We block
    const iwe = decl?.iWe || {};
    const fullName = String(
      principal?.namesByInitials || [principal?.initials, principal?.surname].filter(Boolean).join(" ")
    ).trim();

    if (!String(iwe?.name || "").trim() && fullName) update("declaration.iWe.name", fullName);
    if (!String(iwe?.nicNo || "").trim() && String(principal?.nic || "").trim()) update("declaration.iWe.nicNo", principal.nic);
    if (!String(iwe?.address || "").trim() && String(principal?.permanentAddress || "").trim()) update("declaration.iWe.address", principal.permanentAddress);

    const cdsPrefix = principal?.cds?.prefix;
    const cdsNumber = principal?.cds?.number;
    if (!String(iwe?.cds?.prefix || "").trim() && String(cdsPrefix || "").trim()) update("declaration.iWe.cds.prefix", cdsPrefix);
    if (!String(iwe?.cds?.number || "").trim() && String(cdsNumber || "").trim()) update("declaration.iWe.cds.number", cdsNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region, type, form?.clientRegistration?.principal?.initials, form?.clientRegistration?.principal?.namesByInitials, form?.clientRegistration?.principal?.surname, form?.clientRegistration?.principal?.nic, form?.clientRegistration?.principal?.permanentAddress, form?.clientRegistration?.principal?.cds?.prefix, form?.clientRegistration?.principal?.cds?.number, form?.clientRegistration?.jointApplicant?.enabled, form?.clientRegistration?.jointApplicant?.initials, form?.clientRegistration?.secondJointApplicant?.enabled, form?.clientRegistration?.secondJointApplicant?.initials]);

  const validateStep = (overrideKey) => {
    setError("");
    setFieldErrors({});

const requireUpload = (fileVal, existingKey, msg) => {
  const ok = !!fileVal || (isEditing && hasExisting(existingKey));
  if (!ok) {
    setError(msg);
    setFieldErrors({ [existingKey]: msg });
    showToast(msg);
    scrollFormTop(true);
    return false;
  }
  return true;
};

const fail = (path, msg, { toast = true } = {}) => {
  setError(msg);
  if (path) setFieldErrors({ [path]: msg });
  else setFieldErrors({});
  if (toast) showToast(msg);
  scrollFormTop(true);
  return false;
};




    // When navigating by clicking a step in the left panel we need to validate
    // the *source* step, not necessarily the currently rendered one.
    const key = overrideKey || currentKey;

    // Format validations (email/phone/NIC/account) for the current step
    const section = form?.[key] || {};
    const stepFieldErrors = {};
    const addStepError = (path, message) => {
      if (!path || stepFieldErrors[path]) return;
      stepFieldErrors[path] = message;
    };
    const flushStepErrors = (fallbackMessage = "Please review the highlighted fields.") => {
      const entries = Object.entries(stepFieldErrors);
      if (!entries.length) return false;
      const summary = entries.length === 1 ? entries[0][1] : `${entries.length} fields need attention. Please review the highlighted items.`;
      setError(summary || fallbackMessage);
      setFieldErrors(stepFieldErrors);
      showToast(summary || fallbackMessage);
      scrollFormTop(true);
      return true;
    };

    // Joint/2nd joint flags are used in multiple steps (especially Client Agreement).
    // These MUST be declared before they're referenced, otherwise the step navigation
    // can crash (e.g., Next button appears to do nothing).
    const jointEnabled = !!form?.clientRegistration?.jointApplicant?.enabled;
    const secondJointEnabled = !!form?.clientRegistration?.secondJointApplicant?.enabled;
    for (const item of walkObject(section, key)) {
      const p = item.path;   // ✅ full path
      const v = item.value;

      if (isEmailKey(p) && String(v || "").trim() && !validateEmail(v)) {
        const msg = "Invalid email address.";
        if (isLocalCorporate(region, type) && key === "clientRegistration") {
          addStepError(p, msg);
          continue;
        }
        setError(msg);
        setFieldErrors({ [p]: msg });
        showToast(msg);
        scrollFormTop(true);
        return false;
      }

      // if (isPhoneKey(p) && String(v || "").trim() && !validatePhoneValue(v)) {
      //   const msg = "Invalid phone number. Use digits only and select the country code.";
      //   setError(msg);
      //   setFieldErrors({ [p]: msg });
      //   showToast(msg);
      //   scrollFormTop(true);
      //   return false;
      // }

      if (isAccountKey(p) && String(v || "").trim() && digitsOnly(v) !== String(v).trim()) {
        const msg = "Invalid account number. Use digits only.";
        if (isLocalCorporate(region, type) && key === "clientRegistration") {
          addStepError(p, msg);
          continue;
        }
        setError(msg);
        setFieldErrors({ [p]: msg });
        showToast(msg);
        scrollFormTop(true);
        return false;
      }

      if (region === "local") {
        // Local -> Individual Declaration: NIC fields are validated in the dedicated
        // declaration validation block further below. Skipping them here prevents
        // false "Invalid NIC" errors caused by the generic field traversal.
        if (type === "individual" && key === "declaration" && String(p || "").startsWith("declaration.")) {
          continue;
        }

        // Standard NIC fields
        if (isNicKey(p) && !String(p || "").toLowerCase().includes("nicorpassport") && String(v || "").trim() && !validateLocalNic(v) && !(isLocalCorporate(region, type) && key === "beneficialOwnership" && String(p).toLowerCase().includes("nicorpassport"))) {
          const msg = "Invalid NIC.";
          if (isLocalCorporate(region, type) && key === "clientRegistration") {
            addStepError(p, msg);
            continue;
          }
          setError(msg);
          setFieldErrors({ [p]: msg });

          // Local -> Individual: validate but don't spam popup messages
          if (!(type === "individual")) {
            showToast(msg);
          }

          scrollFormTop(true);
          return false;
        }

// Local Individual -> Payment Instruction idNo fields can contain NIC/..validate only when it looks like NIC
        if (isPaymentInstructionIdNoKey(p) && looksLikeLocalNic(v) && !validateLocalNic(v)) {
          const msg = "Invalid NIC.";
          setError(msg);
          showToast(msg);
          scrollFormTop(true);
          return false;
        }
      }

    }


    // Local -> Corporate validations (lightweight)
    if (isLocalCorporate(region, type)) {
      if (key === "clientRegistration") {
        const c = form?.clientRegistration || {};
        if (!String(c.companyName || "").trim()) addStepError("clientRegistration.companyName", "Company Name is required.");
        const reg = (c.regNo || c.businessRegNo || c.declaration?.businessRegNo || "").trim();
        if (!reg) addStepError("clientRegistration.businessRegNo", "Business Registration No. is required.");
        if (!String(c.email || "").trim()) addStepError("clientRegistration.email", "Company Email is required.");
        if (!lcMemorandumArticles && !hasExisting("lcMemorandumArticles")) addStepError("lcMemorandumArticles", "Please upload the memorandum of articles.");
        if (!lcIncorporationCertificate && !hasExisting("lcIncorporationCertificate")) addStepError("lcIncorporationCertificate", "Please upload the incorporated certificate.");
        if (flushStepErrors("Please review the highlighted corporate form fields.")) return false;
      }
      setError("");
      setFieldErrors({});
      return true;
    }

    // Foreign -> Corporate validations (single-page enhanced)
    if (isForeignCorporate(region, type)) {
      if (key === "fcClientRegistration") {
        const c = form?.fcClientRegistration || {};
        const bd = c?.bankDetails || {};
        const cc = c?.correspondenceContact || {};
        const ou = c?.officeUseOnly || {};
        const decl = c?.declaration || {};

        if (!String(c.companyName || "").trim()) addStepError("fcClientRegistration.companyName", "Company Name is required.");
        if (!String(c.telNos || "").trim()) addStepError("fcClientRegistration.telNos", "Telephone Number is required.");
        if (!String(c.emailAddress || c.email || "").trim()) addStepError("fcClientRegistration.emailAddress", "Company Email is required.");
        if (!String(c.registeredAddress || "").trim()) addStepError("fcClientRegistration.registeredAddress", "Registered Address is required.");
        if (!String(c.correspondenceAddress || "").trim()) addStepError("fcClientRegistration.correspondenceAddress", "Correspondence Address is required.");

        const reg = (c.regNo || c.businessRegNo || c.declaration?.businessRegNo || "").trim();
        if (!reg) addStepError("fcClientRegistration.businessRegNo", "Business Registration No. is required.");
        if (!String(c.dateOfIncorporation || "").trim()) addStepError("fcClientRegistration.dateOfIncorporation", "Date of Incorporation is required.");
        if (!String(c.natureOfBusiness || "").trim()) addStepError("fcClientRegistration.natureOfBusiness", "Nature of Business is required.");

        if (!String(bd.bank || "").trim()) addStepError("fcClientRegistration.bankDetails.bank", "Bank Name is required.");
        if (!String(bd.branch || "").trim()) addStepError("fcClientRegistration.bankDetails.branch", "Bank Branch is required.");
        if (!String(bd.accountType || "").trim()) addStepError("fcClientRegistration.bankDetails.accountType", "Type of Account is required.");
        if (!String(bd.accountNo || "").trim()) addStepError("fcClientRegistration.bankDetails.accountNo", "Account Number is required.");

        if (!String(cc.name || "").trim()) addStepError("fcClientRegistration.correspondenceContact.name", "Correspondence Contact Name is required.");
        if (!String(cc.telNo || "").trim()) addStepError("fcClientRegistration.correspondenceContact.telNo", "Correspondence Contact Telephone is required.");

        if (!String(ou.applicationReceivedOn || "").trim()) addStepError("fcClientRegistration.officeUseOnly.applicationReceivedOn", "Application Received On is required.");
        if (!String(ou.advisorsCode || "").trim()) addStepError("fcClientRegistration.officeUseOnly.advisorsCode", "Advisor's Code is required.");
        if (!String(ou.date || "").trim()) addStepError("fcClientRegistration.officeUseOnly.date", "Office Use Only Date is required.");

        if (!String(decl.weName || c.companyName || "").trim()) addStepError("fcClientRegistration.declaration.weName", "Declaration Company Name is required.");
        if (!String(decl.weBrNo || reg || "").trim()) addStepError("fcClientRegistration.declaration.weBrNo", "Declaration Business Registration No. is required.");
        if (!String(decl.weOf || c.registeredAddress || "").trim()) addStepError("fcClientRegistration.declaration.weOf", "Declaration Address is required.");

        if (!requireUpload(fcMemorandumArticles, "fcMemorandumArticles", "Please upload the Memorandum of Articles.")) return false;
        if (!requireUpload(fcIncorporationCertificate, "fcIncorporationCertificate", "Please upload the Incorporated Certificate.")) return false;
        if (!requireUpload(fcDir1Sig, "fcDir1Sig", "Please upload Signature of Director 1.")) return false;
        if (!requireUpload(fcDir2Sig, "fcDir2Sig", "Please upload Signature of Director 2.")) return false;
        if (!requireUpload(fcCompanySeal, "fcCompanySeal", "Please upload Company Seal.")) return false;

        if (flushStepErrors("Please review the highlighted foreign corporate form fields.")) return false;
      }
      setError("");
      setFieldErrors({});
      return true;
  }





    // ---------------- clientRegistration validations ----------------
    if (key === "clientRegistration") {
      // ✅ Updated (Requested): Local → Individual is now a simplified
      // one-screen Client Registration with only 4 fields.
      if (isLocalIndividual(region, type)) {
        const p = form?.clientRegistration?.principal || {};
        if (!String(p.title || "").trim()) return fail("clientRegistration.principal.title", "Title is required.");
        // Local Individual simplified form does NOT include an "Initials" field.
        // Validate only fields that exist in the UI.
        if (!String(p.name || "").trim()) return fail("clientRegistration.principal.name", "Name is required.");
        if (!String(p.surname || "").trim()) return fail("clientRegistration.principal.surname", "Surname is required.");

        // No uploads required for this simplified form.
        return true;
      }

      // Default behavior for other flows that share the same key
      const p = form?.clientRegistration?.principal;
      if (!p?.email) return fail("clientRegistration.principal.email", "Principal Applicant Email is required.");
      if (!p?.nic) return fail("clientRegistration.principal.nic", "Principal Applicant NIC is required.");

      const jointEnabled = !!form?.clientRegistration?.jointApplicant?.enabled;
      if (jointEnabled && !form?.clientRegistration?.jointApplicant?.nic) {
        return fail("clientRegistration.jointApplicant.nic", "Joint Applicant NIC is required.");
      }

      if (!requireUpload(bankProof, "bankProof", "Please upload Bank Proof.")) return false;
      if (!requireUpload(principalSig, "principalSig", "Please upload Principal Applicant Signature.")) return false;

      // ✅ jointSig + secondJointSig are OPTIONAL (no validation)
    }

    // ---------------- foreignIndividual: fiClientRegistration validations ----------------
    if (key === "fiClientRegistration") {
      const fi = form?.fiClientRegistration || {};
      const principal = fi?.principal || {};
      const joint = fi?.jointApplicant || {};
      const second = fi?.secondJointApplicant || {};
      const fiJointEnabled = !!joint?.enabled;
      const fiSecondJointEnabled = !!second?.enabled;

      const addRequired = (path, value, message) => {
        if (!String(value || "").trim()) addStepError(path, message);
      };

      addRequired("fiClientRegistration.principal.title", principal?.title, "Principal applicant title is required.");
      addRequired("fiClientRegistration.principal.name", principal?.name, "Principal applicant name is required.");
      addRequired("fiClientRegistration.principal.surname", principal?.surname, "Principal applicant surname is required.");
      addRequired("fiClientRegistration.principal.mobile", principal?.mobile, "Principal applicant mobile number is required.");
      addRequired("fiClientRegistration.principal.email", principal?.email, "Principal applicant email is required.");
      addRequired("fiClientRegistration.principal.permanentAddress", principal?.permanentAddress, "Principal applicant permanent address is required.");
      addRequired("fiClientRegistration.principal.identityNo", principal?.identityNo, "Principal applicant ID / Passport number is required.");
      addRequired("fiClientRegistration.principal.occupation", principal?.occupation, "Principal applicant occupation is required.");
      addRequired("fiClientRegistration.principal.bank", principal?.bank, "Bank name is required.");
      addRequired("fiClientRegistration.principal.branch", principal?.branch, "Bank branch is required.");
      addRequired("fiClientRegistration.principal.accountType", principal?.accountType, "Type of account is required.");
      addRequired("fiClientRegistration.principal.accountNo", principal?.accountNo, "Account number is required.");
      addRequired("fiClientRegistration.investmentDecision.type", fi?.investmentDecision?.type, "Investment decision type is required.");
      addRequired("fiClientRegistration.staffDeclaration.advisorName", fi?.staffDeclaration?.advisorName, "Advisor name is required.");
      addRequired("fiClientRegistration.authorizedInstructions.nameAndAddress", fi?.authorizedInstructions?.nameAndAddress, "Authorized instruction name and address is required.");
      addRequired("fiClientRegistration.officeUseOnly.applicationReceivedOn", fi?.officeUseOnly?.applicationReceivedOn, "Application received date is required.");
      addRequired("fiClientRegistration.officeUseOnly.advisorsName", fi?.officeUseOnly?.advisorsName, "Office use advisor name is required.");

      if (!principal?.riskAcknowledged) {
        addStepError("fiClientRegistration.principal.riskAcknowledged", "Please acknowledge the risk of security trading.");
      }

      if (!principal?.identityFront && !(isEditing && hasExisting("fiPrincipalIdFront"))) {
        addStepError("fiClientRegistration.principal.identityFront", "Please upload the principal applicant ID front side.");
      }
      if (!principal?.identityBack && !(isEditing && hasExisting("fiPrincipalIdBack"))) {
        addStepError("fiClientRegistration.principal.identityBack", "Please upload the principal applicant ID back side.");
      }
      if (!principal?.utilityBill && !(isEditing && hasExisting("fiPrincipalUtilityBill"))) {
        addStepError("fiClientRegistration.principal.utilityBill", "Please upload the principal applicant utility bill.");
      }

      if (fiJointEnabled) {
        addRequired("fiClientRegistration.jointApplicant.name", joint?.name, "Joint applicant name is required.");
        addRequired("fiClientRegistration.jointApplicant.surname", joint?.surname, "Joint applicant surname is required.");
        addRequired("fiClientRegistration.jointApplicant.email", joint?.email, "Joint applicant email is required.");
        addRequired("fiClientRegistration.jointApplicant.identityNo", joint?.identityNo, "Joint applicant ID / Passport number is required.");
        if (!joint?.identityFront) addStepError("fiClientRegistration.jointApplicant.identityFront", "Please upload the joint applicant ID front side.");
        if (!joint?.identityBack) addStepError("fiClientRegistration.jointApplicant.identityBack", "Please upload the joint applicant ID back side.");
      }

      if (fiSecondJointEnabled) {
        addRequired("fiClientRegistration.secondJointApplicant.name", second?.name, "2nd joint applicant name is required.");
        addRequired("fiClientRegistration.secondJointApplicant.resAddress", second?.resAddress, "2nd joint applicant residential address is required.");
        addRequired("fiClientRegistration.secondJointApplicant.identityNo", second?.identityNo, "2nd joint applicant ID / Passport number is required.");
        addRequired("fiClientRegistration.secondJointApplicant.nationality", second?.nationality, "2nd joint applicant nationality is required.");
        addRequired("fiClientRegistration.secondJointApplicant.tel", second?.tel, "2nd joint applicant telephone number is required.");
        if (!second?.identityFront) addStepError("fiClientRegistration.secondJointApplicant.identityFront", "Please upload the 2nd joint applicant ID front side.");
        if (!second?.identityBack) addStepError("fiClientRegistration.secondJointApplicant.identityBack", "Please upload the 2nd joint applicant ID back side.");
      }

      if (flushStepErrors("Please review the highlighted foreign individual form fields.")) return false;

      if (!isEditing) {
        if (!requireUpload(principalSig, "principalSig", "Please upload Signature of Principal Applicant.")) return false;
        if (fiJointEnabled && !requireUpload(jointSig, "jointSig", "Please upload Signature of Joint Applicant.")) return false;
        if (fiSecondJointEnabled && !requireUpload(secondJointSig, "secondJointSig", "Please upload Signature of 2nd Joint Applicant.")) return false;
        if (!requireUpload(clientSig, "clientSig", "Please upload Client Signature.")) return false;
      }

      const d = String(form?.fiClientAgreement?.agreementDate?.date || "").trim();
      const m = String(form?.fiClientAgreement?.agreementDate?.month || "").trim();

      if (d) {
        const dn = parseInt(d, 10);
        if (Number.isNaN(dn) || dn < 1 || dn > 31) {
          const msg = "Invalid date.";
          setError(msg);
          showToast(msg);
          scrollFormTop(true);
          return false;
        }
      }

      if (m) {
        const mn = parseInt(m, 10);
        if (Number.isNaN(mn) || mn < 1 || mn > 12) {
          const msg = "Invalid month.";
          setError(msg);
          showToast(msg);
          scrollFormTop(true);
          return false;
        }
      }
    }

// ---------------- declaration validations ----------------
if (key === "declaration") {
  const s1 = form?.declaration?.schedule1;
  const s2 = form?.declaration?.schedule2;

  if (!s1?.authorisedPersonFullName)
    return fail("paymentInstruction.schedule1.authorizedPersonFullName", "Schedule 1: Authorized person full name is required.");
  if (!s1?.clientNames)
    return fail("paymentInstruction.schedule1.clientNames", "Schedule 1: Client name/s is required.");

  // Signature on behalf of stockbroker firm (advisorSig upload)
  if (!requireUpload(advisorSig, "advisorSig", "Schedule 1: Signature upload is required.")) return false;

  if (!s1?.name) return fail("paymentInstruction.schedule1.person.name", "Schedule 1: Name is required.");
  if (!s1?.designation) return fail("paymentInstruction.schedule1.person.designation", "Schedule 1: Designation is required.");

  // Local -> Individual: NIC format validation (block Next if invalid)
  if (isLocalIndividual(region, type)) {
    const nic1 = s1?.nicNo;
    if (String(nic1 || "").trim() && !validateLocalNic(nic1)) {
      const msg = "Schedule 1: Invalid NIC.";
      setError(msg);
      showToast(msg);
      scrollFormTop(true);
      return false;
    }

    const p1 = s2?.person1?.nicNo;
    if (String(p1 || "").trim() && !validateLocalNic(p1)) {
      const msg = "Schedule 2 (Person 1): Invalid NIC.";
      setError(msg);
      showToast(msg);
      scrollFormTop(true);
      return false;
    }

    const p2 = s2?.person2?.nicNo;
    if (String(p2 || "").trim() && !validateLocalNic(p2)) {
      const msg = "Schedule 2 (Person 2): Invalid NIC.";
      setError(msg);
      showToast(msg);
      scrollFormTop(true);
      return false;
    }

    const p3 = s2?.person3?.nicNo;
    if (String(p3 || "").trim() && !validateLocalNic(p3)) {
      const msg = "Schedule 2 (Person 3): Invalid NIC.";
      setError(msg);
      showToast(msg);
      scrollFormTop(true);
      return false;
    }
  }
  if (!s1?.nicNo) return fail("paymentInstruction.schedule1.person.nicNo", "Schedule 1: NIC No is required.");
  if (!s1?.date) return fail("paymentInstruction.schedule1.date", "Schedule 1: Date is required.");

  // Schedule 2: at least person (1) + explainedByName + date
  if (!s2?.person1?.name || !s2?.person1?.nicNo || !s2?.person1?.address)
    return fail("paymentInstruction.schedule2.person1", "Schedule 2: Person (1) name, NIC and address are required.");
  if (!s2?.explainedByName)
    return fail("paymentInstruction.schedule2.explainedByName", "Schedule 2: Explained by (Name) is required.");
  if (!s2?.date) return fail("paymentInstruction.schedule2.date", "Schedule 2: Date is required.");

  // Client signature (optional in UI right now; keep optional to avoid blocking submit)
  // If you add a client signature upload field, you can enforce it here.
}

    
    // ---------------- creditFacility validations ----------------
    if (key === "creditFacility") {
      const d1 = form?.creditFacility?.date?.day;
      const m1 = form?.creditFacility?.date?.month;
      const d2 = form?.creditFacility?.execution?.date;
      const m2 = form?.creditFacility?.execution?.month;

      if (!validateCFDay(d1)) {
        const msg = "Invalid Date.";
        setError(msg);
        setFieldErrors({ [p]: msg });
        showToast(msg);
        scrollFormTop(true);
        return false;
      }
      if (!validateCFMonth(m1)) {
        const msg = "Invalid Month";
        setError(msg);
        setFieldErrors({ [p]: msg });
        showToast(msg);
        scrollFormTop(true);
        return false;
      }
      if (!validateCFDay(d2)) {
        const msg = "Invalid Date.";
        setError(msg);
        setFieldErrors({ [p]: msg });
        showToast(msg);
        scrollFormTop(true);
        return false;
      }
      if (!validateCFMonth(m2)) {
        const msg = "Invalid Month.";
        setError(msg);
        setFieldErrors({ [p]: msg });
        showToast(msg);
        scrollFormTop(true);
        return false;
      }
    }

    // Foreign -> Individual -> Client Agreement: Date/Month range validation
    if (key === "fiClientAgreement") {
      const d = String(form?.fiClientAgreement?.agreementDate?.date || "").trim();
      const m = String(form?.fiClientAgreement?.agreementDate?.month || "").trim();

      if (d) {
        const dn = parseInt(d, 10);
        if (Number.isNaN(dn) || dn < 1 || dn > 31) {
          const msg = "Invalid date.";
          setError(msg);
          showToast(msg);
          scrollFormTop(true);
          return false;
        }
      }

      if (m) {
        const mn = parseInt(m, 10);
        if (Number.isNaN(mn) || mn < 1 || mn > 12) {
          const msg = "Invalid month.";
          setError(msg);
          showToast(msg);
          scrollFormTop(true);
          return false;
        }
      }
    }


// ---------------- accept checkbox steps ----------------
    // IMPORTANT:
    // The last step (Direction Online Form) should allow submitting once the fields
    // are filled. In your current UI, the "accepted" checkbox isn't consistently
    // wired, which caused the Submit button to always show "Please accept to proceed."
    // So we DO NOT block submission based on `directionOnline.accepted` here.

    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    scrollFormTop(false);
    setStep((s) => Math.min(total, s + 1));
  };

  const back = () => {
    scrollFormTop(false);
    setStep((s) => Math.max(1, s - 1));
  };

  // Clicking a step in the left panel must obey the same rules as the Next button:
  // - You can always go back to a previous step.
  // - You can go forward ONLY if the current (and any intermediate) steps validate.
  const goToStep = (targetStep) => {
    if (busy) return;
    const t = Number(targetStep);
    if (!Number.isFinite(t)) return;
    const target = Math.min(Math.max(1, t), total);

    if (target === step) return;

    // Backward navigation is always allowed.
    if (target < step) {
      setError("");
      scrollFormTop(false);
      setStep(target);
      return;
    }

    // Forward navigation: validate each step from current -> target-1
    for (let s = step; s < target; s++) {
      const k = steps?.[s - 1]?.key;
      if (!validateStep(k)) return;
    }

    scrollFormTop(false);
    setStep(target);
  };

  const openPreview = () => {
    try {
      const markup = buildPreviewSnapshot(formScrollRef.current, {
        formVariant: isLocalIndividual(region, type)
          ? "local_individual"
          : isForeignIndividual(region, type)
          ? "foreign_individual"
          : "",
        previewImageMap: {
          localIndividualPrincipalSignature: principalSignaturePreviewUrl,
          jointApplicantSignature: jointSignaturePreviewUrl,
          secondJointApplicantSignature: secondJointSignaturePreviewUrl,
          authorizerSignature: authorizerSignaturePreviewUrl,
          clientSignature: clientSignaturePreviewUrl,
          advisorSignature: advisorSignaturePreviewUrl,
          witness1Signature: witness1SignaturePreviewUrl,
          witness2Signature: witness2SignaturePreviewUrl,
          companySealSignature: authorizerSignaturePreviewUrl,
        },
      });
      setPreviewMarkup(markup);
      setPreviewOpen(true);
    } catch {
      setPreviewMarkup("");
      setPreviewOpen(true);
    }
  };

  const doSubmit = async () => {
    if (!validateStep()) return;
    setBusy(true);
    setError("");

    try {
      // Materialize all auto-filled/computed fields into formData before submit/update
      // so the emailed PDF matches the UI.
      const formForSubmit = materializeAutofillForSubmit(form, region, type);

      const computedFormKey = isLocalIndividual(region, type)
        ? "local_individual"
        : isLocalCorporate(region, type)
        ? "local_corporate"
        : isForeignIndividual(region, type)
        ? "foreign_individual"
        : isForeignCorporate(region, type)
        ? "foreign_corporate"
        : "unknown";

      // IMPORTANT: prune state to only the relevant steps for the selected wizard.
      const prunedFormData = pruneFormDataForFormKey(computedFormKey, formForSubmit);

      const payload = {
        region,
        applicantType: type,
        formKey: computedFormKey,
        formData: prunedFormData,
      };

      
      const fileLabels = {
        bankProof: "Bank Proof",
        principalSig: "Signature of Principal Applicant",
        jointSig: "Signature of Joint Applicant",
        secondJointSig: "Signature of 2nd Joint Applicant",
        liPrincipalIdFront: "Principal - NIC/Passport Front",
        liPrincipalIdBack: "Principal - NIC/Passport Back",
        liPrincipalUtilityBill: "Principal - Utility Bill",
        fiPrincipalUtilityBill: "Foreign Individual Principal - Utility Bill",
        liJointIdFront: "Joint Applicant - NIC/Passport Front",
        liJointIdBack: "Joint Applicant - NIC/Passport Back",
        liSecondJointIdFront: "2nd Joint Applicant - NIC/Passport Front",
        liSecondJointIdBack: "2nd Joint Applicant - NIC/Passport Back",
        liDiscretionaryLetter: "Discretionary Letter",
        liAgentSignature: "Agent/Introducer Signature",
        liOfficeAdvisorSignature: "Office Use - Advisor Signature",
        clientSig: "Client Signature",
        advisorSig: "Investment Advisor Signature",
        corpRegCert: "Certificate of Incorporation / Business Registration",
        kycDocs: "KYC Supporting Documents",
        boDocs: "Beneficial Ownership Supporting Documents",
        fcBoAuthorizedPersonSig: "FC Beneficial Ownership - Authorized Person Signature",
        fcBoAfiSignatureSeal: "FC Beneficial Ownership - AFI Official Signature and Seal",
        boFiSeal: "Company Seal",
        additionalDocs: "Additional Requirements",
        cfPrincipalSig: "Credit Facility - Client Signatory",
        cfFirmSig: "Credit Facility - Company Signatory",
        cfWitness1Sig: "Credit Facility - Witness 1 Signature",
        cfWitness2Sig: "Credit Facility - Witness 2 Signature",
        lcDirector1Sig: "Specimen Signature of Director 1",
        lcDirector2Sig: "Specimen Signature of Director 2",
        lcCompanySeal: "Company Seal",
        lcPiPrincipalSig: "Payment Instruction - Principal Signature",
        lcPiJointSig: "Payment Instruction - Joint Signature",
        lcPiWitnessSig: "Payment Instruction - Witness / Advisor Signature",

        // Local corporate (new)
        lcBankStatement: "Copy Bank Statement",
        lcBoardResolution: "Board Resolution",
        lcMemorandumArticles: "Memorandum of Articles",
        lcIncorporationCertificate: "Incorporated Certificate",
        lcAgentSignature: "Signature of Agent",
        lcAuthorizerSignature: "Signature of Authorizer",
        lcStockbrokerFirmSignature: "Signature of Stockbroker Firm",
        lcWitness1Signature: "Signature of Witness 1",
        lcWitness2Signature: "Signature of Witness 2",
        lcPrincipalApplicantSignature: "Signature of Principal Applicant",
        lcJointApplicantSignature: "Signature of Joint Applicant",

        // Foreign corporate
        fcBankStatement: "Copy Bank Statement",
        fcBoardResolution: "Board Resolution",
        fcMemorandumArticles: "Memorandum of Articles",
        fcIncorporationCertificate: "Incorporated Certificate",
        fcDir1Sig: "Signature of Director 1",
        fcDir2Sig: "Signature of Director 2",
        fcCompanySeal: "Company Seal",
        fcFinalDir1Sig: "Final - Signature of Director 1",
        fcFinalDir2Sig: "Final - Signature of Director 2",
        fcFinalCompanySeal: "Final - Company Seal",
        fcCertOfficerSig: "Final - Signature of Certifying Officer",
        fcKycAuthorizedSignatorySig: "KYC - Signature of Authorized Signatory",
        fcKycCertifyingOfficerSig: "KYC - Signature of Certifying Officer",
        fcKycInvestmentAdvisorSig: "KYC - Signature of Investment Advisor",
      };

      const renameFile = (file, friendlyName) => {
        if (!file) return null;
        try {
          if (typeof File !== "undefined" && file instanceof File) {
            const name = String(friendlyName || "Document").trim() || "Document";
            const original = file.name || "";
            const extMatch = original.match(/(\.[a-zA-Z0-9]+)$/);
            const ext = extMatch ? extMatch[1] : "";
            return new File([file], `${name}${ext}`, { type: file.type });
          }
        } catch {}
        return file;
      };

      const filesRaw = {
        bankProof,
        principalSig,
        jointSig,
        secondJointSig,
        liPrincipalIdFront,
        liPrincipalIdBack,
        liPrincipalUtilityBill,
        fiPrincipalUtilityBill: form?.fiClientRegistration?.principal?.utilityBill || null,
        liJointIdFront,
        liJointIdBack,
        liSecondJointIdFront,
        liSecondJointIdBack,
        liDiscretionaryLetter,
        liAgentSignature,
        liOfficeAdvisorSignature,
        clientSig,
        advisorSig,
        corpRegCert,
        kycDocs,
        boDocs,
        boFiSeal,
        additionalDocs,
        cfPrincipalSig,
        cfFirmSig,
        cfWitness1Sig,
        cfWitness2Sig,
        lcDirector1Sig,
        lcDirector2Sig,
        lcCompanySeal,

        // local corporate (new)
        lcBankStatement,
        lcBoardResolution,
        lcMemorandumArticles,
        lcIncorporationCertificate,
        lcAgentSignature,
        lcAuthorizerSignature,
        lcStockbrokerFirmSignature,
        lcWitness1Signature,
        lcWitness2Signature,
        lcPrincipalApplicantSignature,
        lcJointApplicantSignature,

        // foreign corporate
        fcBankStatement,
        fcBoardResolution,
        fcMemorandumArticles,
        fcIncorporationCertificate,
        fcDir1Sig,
        fcDir2Sig,
        fcCompanySeal,
        fcFinalDir1Sig,
        fcFinalDir2Sig,
        fcFinalCompanySeal,
        fcCertOfficerSig,
        fcKycAuthorizedSignatorySig,
        fcKycCertifyingOfficerSig,
        fcKycInvestmentAdvisorSig,
        fcBoAuthorizedPersonSig,
        fcBoAfiSignatureSeal,
      };

      const renamedFiles = Object.fromEntries(
        Object.entries(filesRaw).map(([k, f]) => [k, renameFile(f, fileLabels[k] || k)])
      );

      const res = isEditing
        ? await updateApplication({
            id: editId,
            data: payload,
            files: renamedFiles,
          })
        : await submitApplication({
            data: payload,
            files: renamedFiles,
          });

      clearDraft(region, type);

      // Store edit info locally (so user can come back within 7 days from same device/browser)
      try {
        if (!isEditing) {
          const editInfo = {
            id: res?.id,
            region,
            type,
            editUntil: res?.editUntil,
            editWindowDays: res?.editWindowDays,
          };
          localStorage.setItem("smartportal:lastEdit", JSON.stringify(editInfo));
        }
      } catch {}

      window.alert(isEditing ? "Application updated successfully!" : "Application submitted successfully!");
      nav("/success", {
        state: {
          id: res?.id,
          region,
          type,
          editUntil: res?.editUntil,
          editWindowDays: res?.editWindowDays,
          updated: isEditing ? true : false,
        },
      });
    } catch (e) {
      setError(e?.message || "Submit failed");
    } finally {
      setBusy(false);
    }
  };

  const isLI = isLocalIndividual(region, type);
  const isLC = isLocalCorporate(region, type);
  const isFI = isForeignIndividual(region, type);
  const isFC = isForeignCorporate(region, type);

  if (!isLI && !isLC && !isFI && !isFC) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white grid place-items-center px-6">
        <div className="max-w-lg text-center">
          <h1 className="text-2xl font-semibold">Flow not configured</h1>
          <p className="mt-2 text-zinc-400">
            Please choose Local → Individual, Local → Corporate, or Foreign → Individual.
          </p>
        </div>
      </div>
    );
  }

  const jointEnabled = isLI ? !!form?.clientRegistration?.jointApplicant?.enabled : false;
  const secondJointEnabled = isLI ? !!form?.clientRegistration?.secondJointApplicant?.enabled : false;

  return (
    // Full-screen layout: keep header + stepper visible; only the form area scrolls.
    <div
      className={`h-screen overflow-hidden relative text-zinc-900 dark:text-white ${
        isFormRoute ? "" : "bg-gradient-to-b from-zinc-50 via-zinc-50 to-white dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900"
      }`}
      style={pageBgStyle}
    >
      {isFormRoute && (
        <div className="absolute inset-0 bg-white/65 dark:bg-zinc-950/70 backdrop-blur-sm" />
      )}
      <div className="relative w-full h-full flex flex-col">
        {/* Header (always visible) */}
        {toast ? (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
            <div className="rounded-2xl border border-red-900/40 bg-red-950/80 px-4 py-3 text-sm text-red-100 shadow-lg backdrop-blur">
              {toast}
            </div>
          </div>
        ) : null}
        {/*
          Mobile: add more top padding so the fixed menu+title header
          doesn't overlap the progress/step card.
        */}
        {/*
          Mobile: we keep the page non-scroll on desktop, but on small screens
          we still need enough space under the fixed header (menu+title + theme toggle).
          Slightly reduce the padding so the Step badge sits higher.
        */}
        {hideStepUI && <div className="pt-16 sm:pt-5" />}
        {!hideStepUI && (
          <div className="px-3 sm:px-6 pt-16 sm:pt-5 pb-3 sm:pb-4">
            <div className="flex items-center justify-end gap-4">
              {/* Application title is now shown next to the menu icon to save vertical space */}
              <div className="rounded-2xl border border-zinc-200 bg-white/70 px-2 sm:px-3 py-1.5 sm:py-2 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/60">
                <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">Step</div>
                <div className="text-lg sm:text-xl font-semibold">
                  {step} / {total}
                </div>
              </div>
            </div>

            <div className="mt-3 sm:mt-4 h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div className="h-2 rounded-full bg-zinc-900 dark:bg-white" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        {/* Body (no page scroll) */}
        <div className="flex-1 min-h-0 px-3 sm:px-6 pb-8 overflow-y-auto overscroll-contain">
          {/*
            Layout note:
            Use an explicit sidebar width on large screens so the Steps column stays narrow
            and the form area gets maximum space.
          */}
          {/*
            Make the Steps column narrower so it doesn't take too much horizontal space.
            (You asked to reduce the left-side length of the Steps area.)
          */}
          <div
            className={
              hideStepUI
                ? "grid grid-cols-1 gap-6 lg:h-full"
                : "grid grid-cols-1 lg:grid-cols-[180px_minmax(0,1fr)] xl:grid-cols-[200px_minmax(0,1fr)] gap-6 lg:h-full"
            }
          >
          {!hideStepUI && (
            <aside>
              <div className="rounded-3xl border border-zinc-200 bg-white/70 p-3 sticky top-6 shadow-soft backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/60">
                <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Steps</div>
                <div className="mt-4">
                  <Stepper
                    steps={steps.map((s) => s.title)}
                    current={step}
                    onStepClick={goToStep}
                  />
                </div>
              </div>
            </aside>
          )}
          
          <main className="lg:h-full flex flex-col min-h-0">
            {/* Form card (scrollable content) */}
            <br></br>
            <br></br>
            <br></br>
            <div className="rounded-3xl border border-zinc-200 bg-white/70 p-3 sm:p-5 text-[13px] sm:text-sm flex flex-col min-h-0 shadow-soft backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/60">
              <div ref={formScrollRef} className="flex-1 min-h-0 overflow-y-auto pr-1 sm:pr-2">
              <FormErrorProvider errors={fieldErrors}>

              {error ? (
                <div className="mb-4 overflow-hidden rounded-3xl border border-orange-300/70 bg-gradient-to-r from-orange-50 via-amber-50 to-red-50 text-sm text-orange-950 shadow-sm dark:border-orange-900/40 dark:from-orange-950/35 dark:via-amber-950/25 dark:to-red-950/20 dark:text-orange-100">
                  <div className="border-b border-orange-200/70 px-4 py-3 dark:border-orange-900/40">
                    <div className="font-semibold">Please review the highlighted field{Object.keys(fieldErrors || {}).length === 1 ? "" : "s"}.</div>
                    <div className="mt-1">{error}</div>
                  </div>
                  {Object.keys(fieldErrors || {}).length ? (
                    <div className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(fieldErrors || {}).slice(0, 10).map(([path, message]) => (
                          <button
                            key={path}
                            type="button"
                            onClick={() => jumpToField(path)}
                            className="rounded-full border border-orange-300 bg-white/85 px-3 py-1.5 text-left text-xs font-medium text-orange-900 transition hover:-translate-y-0.5 hover:bg-white dark:border-orange-800 dark:bg-zinc-950/60 dark:text-orange-100"
                            title={message}
                          >
                            {message}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {/* ===================== CLIENT REGISTRATION ===================== */}

              {/* ✅ Local → Individual (NEW simplified form) */}
              {isLocalIndividual(region, type) && currentKey === "clientRegistration" && (
                <>
                  <div className="mb-5 rounded-3xl border border-zinc-200 bg-white/60 px-4 py-4 shadow-soft backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/50">
                    <div className="flex flex-col gap-1">
                      <h2 className="text-lg sm:text-xl font-semibold">Client Registration</h2>
                      {/* <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                        Local Individual application (as per the official form)
                      </div> */}
                    </div>
                  </div>

                  {/* PRINCIPAL APPLICANT */}
                  <SectionTitle className="uppercase tracking-wide">Principal Applicant</SectionTitle>
                  <div className="mt-2 rounded-3xl border border-zinc-200 bg-white/70 p-4 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/30">
<div className="grid grid-cols-1 gap-4">
                      <div className="md:col-span-2">
                      <Field label="Title">
                        <Select
                          value={form.clientRegistration.principal.title}
                          path="clientRegistration.principal.title"
                          onChange={(e) => update("clientRegistration.principal.title", e.target.value)}
                        >
                          <option value="">Select</option>
                          <option value="Rev">Rev.</option>
                          <option value="Mr">Mr.</option>
                          <option value="Mrs">Mrs.</option>
                          <option value="Ms">Ms.</option>
                        </Select>
                      </Field>
                      </div>
                        
                      <div className="md:col-span-2"> 
                      <Field label="Name">
                        <Input
                          value={form.clientRegistration.principal.name}
                          path="clientRegistration.principal.name"
                          onChange={(e) => update("clientRegistration.principal.name", e.target.value)}
                          placeholder="Enter Name"
                        />
                      </Field>
                      </div>
                        
                      <div className="md:col-span-2">
                      <Field label="Surname">
                        <Input
                          value={form.clientRegistration.principal.surname}
                          path="clientRegistration.principal.surname"
                          onChange={(e) => update("clientRegistration.principal.surname", e.target.value)}
                          placeholder="Enter Surname"
                        />
                      </Field>
                      </div>
                        
                      

                      <div className="md:col-span-2">  
                      <Field label="Tel No (Home)">
                        <PhoneInput
                          value={form.clientRegistration.principal.telHome}
                          path="clientRegistration.principal.telHome"
                          onChange={(v) => update("clientRegistration.principal.telHome", v)}
                          placeholder="Enter Home Tel No"
                        />
                      </Field>
                      </div>

                      <div className="md:col-span-2">
                      <Field label="Tel No (Office)">
                        <PhoneInput
                          value={form.clientRegistration.principal.telOffice}
                          path="clientRegistration.principal.telOffice"
                          onChange={(v) => update("clientRegistration.principal.telOffice", v)}
                          placeholder="Enter Office Tel No"
                        />
                      </Field>
                      </div>
                        
                      <div className="md:col-span-2">  
                      <Field label="Fax No (Home)">
                        <Input
                          value={form.clientRegistration.principal.faxHome || ""}
                          path="clientRegistration.principal.faxHome"
                          onChange={(e) => update("clientRegistration.principal.faxHome", e.target.value)}
                          placeholder="Enter Home Fax No"
                          autoComplete="off"
                        />
                      </Field>
                      </div>

                      <div className="md:col-span-2">
                      <Field label="Fax No (Office)">
                        <Input
                          value={form.clientRegistration.principal.faxOffice || ""}
                          path="clientRegistration.principal.faxOffice"
                          onChange={(e) => update("clientRegistration.principal.faxOffice", e.target.value)}
                          placeholder="Enter Office Fax No"
                          autoComplete="off"
                        />
                      </Field>
                      </div>

                      <div className="md:col-span-2">  
                      <Field label="Mobile No">
                        <PhoneInput
                          value={form.clientRegistration.principal.mobile}
                          path="clientRegistration.principal.mobile"
                          onChange={(v) => update("clientRegistration.principal.mobile", v)}
                          placeholder="Enter Mobile No"
                        />
                      </Field>
                      </div>

                      <div className="md:col-span-2">
                      <Field label="Email" className="md:col-span-2">
                        <Input
                          type="email"
                          value={form.clientRegistration.principal.email}
                          path="clientRegistration.principal.email"
                          onChange={(e) => update("clientRegistration.principal.email", e.target.value)}
                          placeholder="Enter Email Address"
                        />
                      </Field>
                      </div>

                      <div className="md:col-span-2">
                        <Field label="Permanent Address">
                          <textarea
                            value={form.clientRegistration.principal.permanentAddress}
                            onChange={(e) => update("clientRegistration.principal.permanentAddress", e.target.value)}
                            className="w-full text-[13px] sm:text-sm rounded-2xl border border-zinc-300 bg-white/80 px-3 py-2 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-black/20 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100"
                            rows={3}
                            placeholder="Enter Permanent Address"
                          />
                        </Field>
                      </div>

                      <div className="md:col-span-2">
                        <Field label="Correspondence Address">
                          <textarea
                            value={form.clientRegistration.principal.correspondenceAddress}
                            onChange={(e) => update("clientRegistration.principal.correspondenceAddress", e.target.value)}
                            className="w-full text-[13px] sm:text-sm rounded-2xl border border-zinc-300 bg-white/80 px-3 py-2 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-black/20 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100"
                            rows={3}
                            placeholder="Enter Correspondence Address"
                          />
                        </Field>
                      </div>

                      <div className="md:col-span-2">
                      <Field label="NIC / Passport / Driving License">
                        <Input
                          value={form.clientRegistration.principal.identityNo}
                          path="clientRegistration.principal.identityNo"
                          onChange={(e) => update("clientRegistration.principal.identityNo", e.target.value)}
                          placeholder="Enter NIC, Passport or Driving License Number"
                        />
                      </Field>
                      </div> 
                      
                      <br></br>
                      <div className="md:col-span-2">
                      <Field label="Upload Photo of NIC or Passport (Front Side)">
                        <FileUpload
                          label="Upload Front Side"
                          file={liPrincipalIdFront}
                          setFile={setLiPrincipalIdFront}
                          path="uploads.liPrincipalIdFront"
                          accept="image/*,application/pdf"
                        />
                      </Field>
                      </div>

                      <div className="md:col-span-2">
                      <Field label="Upload Photo of NIC or Passport (Back Side)">
                        <FileUpload
                          label="Upload Back Side"
                          file={liPrincipalIdBack}
                          setFile={setLiPrincipalIdBack}
                          path="uploads.liPrincipalIdBack"
                          accept="image/*,application/pdf"
                        />
                      </Field>
                      </div>
                      <br></br>

                      <div className="md:col-span-2">
                      <Field label="CDS A/C No">
                        <Input
                          value={form.clientRegistration.principal.cdsAccountNo}
                          path="clientRegistration.principal.cdsAccountNo"
                          onChange={(e) => update("clientRegistration.principal.cdsAccountNo", e.target.value)}
                          placeholder="Enter CDS Account Number"
                        />
                      </Field>
                      </div>

                      <Field label="Date of Issue">
                        <Input
                          type="date"
                          value={form.clientRegistration.principal.dateOfIssue}
                          path="clientRegistration.principal.dateOfIssue"
                          onChange={(e) => update("clientRegistration.principal.dateOfIssue", e.target.value)}
                          placeholder="dd/MM/yyyy"
                        />
                      </Field>

                      <div className="md:col-span-2">
                      <Field label="Attached Copy of Utility Bill">
                        <FileUpload
                          label="Upload Utility Bill"
                          file={liPrincipalUtilityBill}
                          setFile={setLiPrincipalUtilityBill}
                          path="uploads.liPrincipalUtilityBill"
                          accept="image/*,application/pdf"
                        />
                      </Field>
                      </div>

                      <div className="md:col-span-2">
                      <Field label="Occupation">
                        <Input
                          value={form.clientRegistration.principal.occupation}
                          path="clientRegistration.principal.occupation"
                          onChange={(e) => update("clientRegistration.principal.occupation", e.target.value)}
                          placeholder="Enter Occupation"
                        />
                      </Field>
                      </div>

                      <div className="md:col-span-2">
                        <Field label="Employer’s Address">
                          <textarea
                            value={form.clientRegistration.principal.employerAddress}
                            onChange={(e) => update("clientRegistration.principal.employerAddress", e.target.value)}
                            className="w-full text-[13px] sm:text-sm rounded-2xl border border-zinc-300 bg-white/80 px-3 py-2 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-black/20 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100"
                            rows={2}
                            placeholder="Enter Employer Address"
                          />
                        </Field>
                      </div>

                      <div className="md:col-span-2">
                      <Field label="Employer Contact No">
                        <PhoneInput
                          value={form.clientRegistration.principal.employerContactNo}
                          path="clientRegistration.principal.employerContactNo"
                          onChange={(v) => update("clientRegistration.principal.employerContactNo", v)}
                          placeholder="Enter Employer Contact No"
                        />
                      </Field>
                      </div>

                      

                      
                    </div>
                    <br></br>
                    <Divider />
                    <br></br>

<div className="grid grid-cols-1 gap-4">
                      <h1>Bank / SIA Account Details</h1>
                      <Field label="Bank">
                        <Input
                          value={form.clientRegistration.principal.bank}
                          path="clientRegistration.principal.bank"
                          onChange={(e) => update("clientRegistration.principal.bank", e.target.value)}
                          placeholder="Enter Bank Name"
                        />
                      </Field>

                      <Field label="Branch">
                        <Input
                          value={form.clientRegistration.principal.branch}
                          path="clientRegistration.principal.branch"
                          onChange={(e) => update("clientRegistration.principal.branch", e.target.value)}
                          placeholder="Enter Branch Name"
                        />
                      </Field>

                      <Field label="Type of Account">
                        <Input
                          value={form.clientRegistration.principal.accountType}
                          path="clientRegistration.principal.accountType"
                          onChange={(e) => update("clientRegistration.principal.accountType", e.target.value)}
                          placeholder="Enter Account Type"
                        />
                          {/* <option value="">Select</option>
                          <option value="Savings">Savings</option>
                          <option value="Current">Current</option>
                          <option value="Other">Other</option>
                        </Select> */}
                      </Field>

                      <Field label="Account No">
                        <Input
                          value={form.clientRegistration.principal.accountNo}
                          path="clientRegistration.principal.accountNo"
                          onChange={(e) => update("clientRegistration.principal.accountNo", e.target.value)}
                          placeholder="Enter Account Number"
                        />
                      </Field>

                      <Field label="Stock Market Experience">
                        <Select
                          value={form.clientRegistration.principal.stockMarketExperience}
                          path="clientRegistration.principal.stockMarketExperience"
                          onChange={(e) => update("clientRegistration.principal.stockMarketExperience", e.target.value)}
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </Select>
                      </Field>

                      <Field label="Present Brokers (If Any)" className="md:col-span-3">
                        <Input
                          value={form.clientRegistration.principal.presentBrokers}
                          path="clientRegistration.principal.presentBrokers"
                          onChange={(e) => update("clientRegistration.principal.presentBrokers", e.target.value)}
                          placeholder="Broker name(s)"
                        />
                      </Field>

                     
                      <Divider />
                      
                      <h1>Mailing Instruction</h1>

                      <Field label="Please post our,">
                        <Select
                          value={form.clientRegistration.principal.mailingInstruction}
                          path="clientRegistration.principal.mailingInstruction"
                          onChange={(e) => update("clientRegistration.principal.mailingInstruction", e.target.value)}
                        >
                          <option value="">Select</option>
                          <option value="Post to Office">Correspondence to my office</option>
                          <option value="Post to Home">Contracts to my office</option>
                        </Select>
                      </Field>

                      <Field label="Cheques to be,">
                        <Select
                          value={form.clientRegistration.principal.chequesInstruction}
                          path="clientRegistration.principal.chequesInstruction"
                          onChange={(e) => update("clientRegistration.principal.chequesInstruction", e.target.value)}
                        >
                          <option value="">Select</option>
                          <option value="Posted">Posted</option>
                          <option value="Collect">Collected</option>
                          <option value="Do not prepare">Do not Prepare</option>
                        </Select>
                      </Field>

                      <Field label="Contact Notes">
                        <Select
                          value={form.clientRegistration.principal.contactNotes}
                          path="clientRegistration.principal.contactNotes"
                          onChange={(e) => update("clientRegistration.principal.contactNotes", e.target.value)}
                        >
                          <option value="">Select</option>
                          <option value="Post">Post</option>
                          <option value="Collect">Collect</option>
                          <option value="Email">Email</option>
                        </Select>
                      </Field>
                    </div>

                    <div className="mt-4 rounded-2xl border border-zinc-200 bg-white/60 px-4 py-3 text-xs sm:text-sm text-zinc-700 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-300">
                      <div className="font-semibold mb-1">Risk of Security Trading</div>
                      <br></br>
                      <div>
                        The price of securities fluctuates, sometimes drastically. The price of a security may move up or
                        down, and may even become valueless. It is likely that losses may be incurred as a result of
                        buying and selling securities.
                      </div>
                      <div className="mt-3">
                        <CheckRow
                          checked={!!form.clientRegistration.principal.riskAcknowledged}
                          onChange={(v) => update("clientRegistration.principal.riskAcknowledged", v)}
                          label="I acknowledge that the risk disclosure was explained and understood."
                        />
                      </div>
                    </div>
                  </div>

                  {/* JOINT APPLICANT */}
                  <SectionTitle className="uppercase tracking-wide">Joint Applicant</SectionTitle>
                  <div className="mt-2">
                    <CheckRow
                      checked={!!form.clientRegistration.jointApplicant.enabled}
                      onChange={(v) => update("clientRegistration.jointApplicant.enabled", v)}
                      label="Enable Joint Applicant"
                    />
                  </div>

                  {form.clientRegistration.jointApplicant.enabled && (
                    <div className="mt-3 rounded-3xl border border-zinc-200 bg-white/70 p-4 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/30">
<div className="grid grid-cols-1 gap-4">
                        <div className="md:col-span-2">
                        <Field label="Title">
                          <Select
                            value={form.clientRegistration.jointApplicant.title}
                            path="clientRegistration.jointApplicant.title"
                            onChange={(e) => update("clientRegistration.jointApplicant.title", e.target.value)}
                          >
                            <option value="">Select</option>
                            <option value="Rev">Rev.</option>
                            <option value="Mr">Mr.</option>
                            <option value="Mrs">Mrs.</option>
                            <option value="Ms">Ms.</option>
                          </Select>
                        </Field>
                        </div>

                        <div className="md:col-span-2">
                        <Field label="Name">
                          <Input
                            value={form.clientRegistration.jointApplicant.name}
                            path="clientRegistration.jointApplicant.name"
                            onChange={(e) => update("clientRegistration.jointApplicant.name", e.target.value)}
                            placeholder="Enter Joint Applicant Name"
                          />
                        </Field>
                        </div>

                        <div className="md:col-span-2">
                        <Field label="Surname">
                          <Input
                            value={form.clientRegistration.jointApplicant.surname}
                            path="clientRegistration.jointApplicant.surname"
                            onChange={(e) => update("clientRegistration.jointApplicant.surname", e.target.value)}
                            placeholder="Enter Joint Applicant Surname"
                          />
                        </Field>
                        </div>

                        

                        <div className="md:col-span-2">
                        <Field label="Tel No (Home)">
                          <PhoneInput
                            value={form.clientRegistration.jointApplicant.telHome}
                            path="clientRegistration.jointApplicant.telHome"
                            onChange={(v) => update("clientRegistration.jointApplicant.telHome", v)}
                            placeholder="Enter Joint Applicant Home Tel No"
                          />
                        </Field>
                        </div>

                        <div className="md:col-span-2">
                        <Field label="Tel No (Office)">
                          <PhoneInput
                            value={form.clientRegistration.jointApplicant.telOffice}
                            path="clientRegistration.jointApplicant.telOffice"
                            onChange={(v) => update("clientRegistration.jointApplicant.telOffice", v)}
                            placeholder="Enter Joint Applicant Office Tel No"
                          />
                        </Field>
                        </div>

                        <div className="md:col-span-2">
                        <Field label="Fax No (Home)">
                          <Input
                            value={form.clientRegistration.jointApplicant.faxHome || ""}
                            path="clientRegistration.jointApplicant.faxHome"
                            onChange={(e) => update("clientRegistration.jointApplicant.faxHome", e.target.value)}
                            placeholder="Enter Joint Applicant Home Fax No"
                            autoComplete="off"
                          />
                        </Field>
                        </div>

                        <div className="md:col-span-2">
                        <Field label="Fax No (Office)">
                          <Input
                            value={form.clientRegistration.jointApplicant.faxOffice || ""}
                            path="clientRegistration.jointApplicant.faxOffice"
                            onChange={(e) => update("clientRegistration.jointApplicant.faxOffice", e.target.value)}
                            placeholder="Enter Joint Applicant Office Fax No"
                            autoComplete="off"
                          />
                        </Field>
                        </div>

                        <div className="md:col-span-2">
                        <Field label="Mobile No">
                          <PhoneInput
                            value={form.clientRegistration.jointApplicant.mobile}
                            path="clientRegistration.jointApplicant.mobile"
                            onChange={(v) => update("clientRegistration.jointApplicant.mobile", v)}
                            placeholder="Enter Joint Applicant Mobile No"
                          />
                        </Field>
                        </div>

                        <div className="md:col-span-2">
                        <Field label="Email" className="md:col-span-2">
                          <Input
                            type="email"
                            value={form.clientRegistration.jointApplicant.email}
                            path="clientRegistration.jointApplicant.email"
                            onChange={(e) => update("clientRegistration.jointApplicant.email", e.target.value)}
                            placeholder="Enter Joint Applicant Email Address"
                          />
                        </Field>
                        </div>

                        <div className="md:col-span-2">
                          <Field label="Permanent Address">
                            <textarea
                              value={form.clientRegistration.jointApplicant.permanentAddress}
                              onChange={(e) => update("clientRegistration.jointApplicant.permanentAddress", e.target.value)}
                              className="w-full text-[13px] sm:text-sm rounded-2xl border border-zinc-300 bg-white/80 px-3 py-2 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-black/20 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100"
                              rows={2}
                              placeholder="Enter Joint Applicant Permanent Address"
                            />
                          </Field>
                        </div>

                        <div className="md:col-span-2">
                          <Field label="Correspondence Address">
                            <textarea
                              value={form.clientRegistration.jointApplicant.correspondenceAddress}
                              onChange={(e) => update("clientRegistration.jointApplicant.correspondenceAddress", e.target.value)}
                              className="w-full text-[13px] sm:text-sm rounded-2xl border border-zinc-300 bg-white/80 px-3 py-2 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-black/20 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100"
                              rows={2}
                              placeholder="Enter Joint Applicant Correspondence Address"
                            />
                          </Field>
                        </div>

                        <div className="md:col-span-2">
                        <Field label="NIC / Passport / Driving License">
                          <Input
                            value={form.clientRegistration.jointApplicant.identityNo}
                            path="clientRegistration.jointApplicant.identityNo"
                            onChange={(e) => update("clientRegistration.jointApplicant.identityNo", e.target.value)}
                            placeholder="Enter Joint Applicant NIC, Passport or Driving License Number"
                          />
                        </Field>
                        </div>

                        <div className="md:col-span-2">
                        <Field label="Upload NIC or Passport (Front Side)">
                          <FileUpload
                            label="Upload Front Side"
                            file={liJointIdFront}
                          setFile={setLiJointIdFront}
                          path="uploads.liJointIdFront"
                            accept="image/*,application/pdf"
                          />
                        </Field>
                        </div>

                        <div className="md:col-span-2">
                        <Field label="Upload NIC or Passport (Back Side)">
                          <FileUpload
                            label="Upload Back Side"
                            file={liJointIdBack}
                          setFile={setLiJointIdBack}
                          path="uploads.liJointIdBack"
                            accept="image/*,application/pdf"
                          />
                        </Field>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SECOND JOINT APPLICANT */}
                  <SectionTitle className="uppercase tracking-wide">In Case of 2nd Joint Applicant</SectionTitle>
                  <div className="mt-2">
                    <CheckRow
                      checked={!!form.clientRegistration.secondJointApplicant.enabled}
                      onChange={(v) => update("clientRegistration.secondJointApplicant.enabled", v)}
                      label="Enable 2nd Joint Applicant"
                    />
                  </div>

                  {form.clientRegistration.secondJointApplicant.enabled && (
                    <div className="mt-3 rounded-3xl border border-zinc-200 bg-white/70 p-4 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/30">
<div className="grid grid-cols-1 gap-4">
                        <div className="md:col-span-2">
                        <Field label="Name">
                          <Input
                            value={form.clientRegistration.secondJointApplicant.name}
                            path="clientRegistration.secondJointApplicant.name"
                            onChange={(e) => update("clientRegistration.secondJointApplicant.name", e.target.value)}
                            placeholder="Enter 2nd Joint Applicant Name"
                          />
                        </Field>
                        </div>

                        <div className="md:col-span-2">
                          <Field label="Residential Address">
                            <textarea
                              value={form.clientRegistration.secondJointApplicant.resAddress}
                              onChange={(e) => update("clientRegistration.secondJointApplicant.resAddress", e.target.value)}
                              className="w-full text-[13px] sm:text-sm rounded-2xl border border-zinc-300 bg-white/80 px-3 py-2 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-black/20 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100"
                              rows={2}
                              placeholder="Enter 2nd Joint Applicant Residential Address"
                            />
                          </Field>
                        </div>

                        <div className="md:col-span-2">
                        <Field label="Occupation">
                          <Input
                            value={form.clientRegistration.secondJointApplicant.occupation}
                            path="clientRegistration.secondJointApplicant.occupation"
                            onChange={(e) => update("clientRegistration.secondJointApplicant.occupation", e.target.value)}
                            placeholder="Enter 2nd Joint Applicant Occupation"
                          />
                        </Field>
                        </div>

                        <div className="md:col-span-2">
                          <Field label="Office Address">
                            <textarea
                              value={form.clientRegistration.secondJointApplicant.officeAddress}
                              onChange={(e) => update("clientRegistration.secondJointApplicant.officeAddress", e.target.value)}
                              className="w-full text-[13px] sm:text-sm rounded-2xl border border-zinc-300 bg-white/80 px-3 py-2 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-black/20 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100"
                              rows={2}
                              placeholder="Enter 2nd Joint Applicant Office Address"
                            />
                          </Field>
                        </div>

                        <div className="md:col-span-2">
                        <Field label="NIC / Passport">
                          <Input
                            value={form.clientRegistration.secondJointApplicant.identityNo}
                            path="clientRegistration.secondJointApplicant.identityNo"
                            onChange={(e) => update("clientRegistration.secondJointApplicant.identityNo", e.target.value)}
                            placeholder="Enter 2nd Joint Applicant NIC or Passport Number"
                          />
                        </Field>
                        </div>

                        <div className="md:col-span-2">
                        <Field label="Upload NIC or Passport (Front Side)">
                          <FileUpload
                            label="Upload Front Side"
                            file={liSecondJointIdFront}
                          setFile={setLiSecondJointIdFront}
                          path="uploads.liSecondJointIdFront"
                            accept="image/*,application/pdf"
                          />
                        </Field>
                        </div>

                        <div className="md:col-span-2">
                        <Field label="Upload NIC or Passport (Back Side)">
                          <FileUpload
                            label="Upload Back Side"
                            file={liSecondJointIdBack}
                          setFile={setLiSecondJointIdBack}
                          path="uploads.liSecondJointIdBack"
                            accept="image/*,application/pdf"
                          />
                        </Field>
                        </div>

                        <Field label="Date of Issue">
                          <Input
                            type="date"
                            value={form.clientRegistration.secondJointApplicant.dateOfIssue}
                            path="clientRegistration.secondJointApplicant.dateOfIssue"
                            onChange={(e) => update("clientRegistration.secondJointApplicant.dateOfIssue", e.target.value)}
                          />
                        </Field>

                        <div className="md:col-span-2">
                        <Field label="Nationality">
                          <Input
                            value={form.clientRegistration.secondJointApplicant.nationality}
                            path="clientRegistration.secondJointApplicant.nationality"
                            onChange={(e) => update("clientRegistration.secondJointApplicant.nationality", e.target.value)}
                            placeholder="Enter 2nd Joint Applicant Nationality"
                          />
                        </Field>
                        </div>

                        <div className="md:col-span-2">
                        <Field label="Tel">
                          <PhoneInput
                            value={form.clientRegistration.secondJointApplicant.tel}
                            path="clientRegistration.secondJointApplicant.tel"
                            onChange={(v) => update("clientRegistration.secondJointApplicant.tel", v)}
                            placeholder="Enter 2nd Joint Applicant Tel No"
                          />
                        </Field>
                        </div>

                        <div className="md:col-span-2">
                        <Field label="Fax">
                          <Input
                            value={form.clientRegistration.secondJointApplicant.fax || ""}
                            path="clientRegistration.secondJointApplicant.fax"
                            onChange={(e) => update("clientRegistration.secondJointApplicant.fax", e.target.value)}
                            placeholder="Enter 2nd Joint Applicant Fax No"
                            autoComplete="off"
                          />
                        </Field>
                        </div>
                      </div>
                    </div>
                  )}

                  <br></br>
                  {/* INVESTMENT DECISION */}
                  {/* <SectionTitle className="uppercase tracking-wide">Investment Decision</SectionTitle> */}
                  <div className="mt-2 rounded-3xl border border-zinc-200 bg-white/70 p-4 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/30">
<div className="grid grid-cols-1 gap-4">
                      <Field label="Investment decision are to be:">
                        <Select
                          value={form.clientRegistration.investmentDecision.type}
                          path="clientRegistration.investmentDecision.type"
                          onChange={(e) => update("clientRegistration.investmentDecision.type", e.target.value)}
                        >
                          <option value="">Select</option>
                          <option value="Discretionary">Discretionary</option>
                          <option value="Non Discretionary">Non Discretionary</option>
                          <option value="Both">If so please fill letter of Discretionary </option>
                        </Select>
                      </Field>

                      {/* <Field label="If Discretionary: Upload Letter">
                        <FileUpload
                          label="Upload discretionary letter (if applicable)"
                          value={liDiscretionaryLetter}
                          onChange={(f) => setLiDiscretionaryLetter(f)}
                          accept="image/*,application/pdf"
                        />
                      </Field> */}
                    </div>
                  </div>
                      
                  <br></br>
                  {/* STAFF DECLARATION */}
                  {/* <SectionTitle className="uppercase tracking-wide">Declaration by the Staff</SectionTitle> */}
                  <div className="mt-2 rounded-3xl border border-zinc-200 bg-white/70 p-4 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/30">
<div className="grid grid-cols-1 gap-4">
                      <Field label="Declaration by the staff">
                        <Select
                          value={form.clientRegistration.staffDeclaration.advisorName}
                          path="clientRegistration.staffDeclaration.advisorName"
                          onChange={(e) => update("clientRegistration.staffDeclaration.advisorName", e.target.value)}
                        >
                          <option value="">Select</option>
                          <option value="Mr. Dimuthu Abeyesekera">Mr. Dimuthu Abeyesekera</option>
                          <option value="Mr. Upul Indrajith Priyantha">Mr. Upul Indrajith Priyantha</option>
                          <option value="Mr. Shanmugam Wickramasinghe">Mr. Shanmugam Wickramasinghe</option>
                          <option value="Mrs. Vasantha Wickramasinghe">Mrs. Vasantha Wickramasinghe</option>
                          <option value="Mrs. Nilmini Hapuarchchi">Mrs. Nilmini Hapuarchchi</option>
                          <option value="Mr. Gamage Jayarathne">Mr. Gamage Jayarathne</option>
                          <option value="Mr. Piyasage Ranasinghe">Mr. Piyasage Ranasinghe</option>
                          <option value="Mr. Buddika Jayasinghe">Mr. Buddika Jayasinghe</option>
                          <option value="Mrs. Chandrika Abeywickrama">Mrs. Chandrika Abeywickrama</option>
                          <option value="Mr. Nuwan Hewage">Mr. Nuwan Hewage</option>
                          <option value="Mr. Mohamed Assim Insaf">Mr. Mohamed Assim Insaf</option>
                          <option value="Mr. Janith Hettiarachchi">Mr. Janith Hettiarachchi</option>
                          <option value="Mr. Dhanushka Fernando">Mr. Dhanushka Fernando</option>
                          <option value="Mr. Vidura De Zoysa">Mr. Vidura De Zoysa</option>
                          <option value="Mr. Prasad Wijesinghe">Mr. Prasad Wijesinghe</option>
                          <option value="Mr. Nilum Samantha">Mr. Nilum Samantha</option>
                          <option value="Mr. Manoj Liyanapathirana">Mr. Manoj Liyanapathirana</option>
                          <option value="Mr. Sugath Siriwardana">Mr. Sugath Siriwardana</option>
                          <option value="Mr. Dinesh Delsi Ravinda">Mr. Dinesh Delsi Ravinda</option>
                          <option value="Mr. Mohamed Iliyas">Mr. Mohamed Iliyas</option>
                          <option value="Mr. Akila Sadun Ekanayake">Mr. Akila Sadun Ekanayake</option>
                          <option value="Mr. Prasanna Sujith Bandara Kangara">Mr. Prasanna Sujith Bandara Kangara</option>
                          <option value="Mr. Sanath Karunaweera">Mr. Sanath Karunaweera</option>
                          <option value="Mr. Nishantha Liyanarachchi">Mr. Nishantha Liyanarachchi</option>
                          <option value="Mr. Vinod Rajitha Ramanayake">Mr. Vinod Rajitha Ramanayake</option>
                          <option value="Mr. Muditha Dananjaya">Mr. Muditha Dananjaya</option>
                          <option value="Mr. Croos Christian Croos">Mr. Croos Christian Croos</option>
                          <option value="Mr. Isuru Poorna Premasiri">Mr. Isuru Poorna Premasiri</option>
                          <option value="Mr. Jeewana helage">Mr. Jeewana helage</option>
                          <option value="Mr. Ranjan Liyanage">Mr. Ranjan Liyanage</option>
                          <option value="Mr. Dilshan Fernando">Mr. Dilshan Fernando</option>
                          <option value="Mr. Ashan Chanaka">Mr. Ashan Chanaka</option>
                          <option value="Mr. Umayanga Rajamanthri">Mr. Umayanga Rajamanthri</option>
                        </Select>
                      </Field>
                      <div className="md:col-span-2">
                        <p> Investment Advisor on behalf of the asha security Ltd has clearly explained the risk disclosure statement to the client while inviting to the client to the read and ask question and take independent advice if the client wishes.</p>
                        {/* <CheckRow
                          checked={!!form.clientRegistration.staffDeclaration.explainedRisk}
                          onChange={(v) => update("clientRegistration.staffDeclaration.explainedRisk", v)}
                          label="Investment advisor has clearly explained the risk disclosure statement to the client."
                        /> */}
                      </div>
                    </div>
                  </div>

                  <br></br>
                  {/* AUTHORIZED INSTRUCTIONS */}
                  {/* <SectionTitle className="uppercase tracking-wide">Name & Address of person/s authorized to give instructions</SectionTitle> */}
                  <div className="mt-2 rounded-3xl border border-zinc-200 bg-white/70 p-4 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/30">
<div className="grid grid-cols-1 gap-4">
                      <div className="md:col-span-2">
                        <Field label="Name & Address of person/s authorizes to give instructions">
                          <textarea
                            value={form.clientRegistration.authorizedInstructions.nameAndAddress}
                            onChange={(e) => update("clientRegistration.authorizedInstructions.nameAndAddress", e.target.value)}
                            className="w-full text-[13px] sm:text-sm rounded-2xl border border-zinc-300 bg-white/80 px-3 py-2 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-black/20 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100"
                            rows={3}
                            placeholder="Enter Name & Address"
                          />
                        </Field>
                      </div>

                      <div className="md:col-span-2">
                      <Field label="Signature of Agent / Person introducing">
                        <FileUpload
                          label="Upload signature (optional)"
                          file={liAgentSignature}
                          setFile={setLiAgentSignature}
                          path="uploads.liAgentSignature"
                          accept="image/*,application/pdf"
                        />
                      </Field>
                      </div>

                      <div className="md:col-span-2">
                      <Field label="Agent Code">
                        <Input
                          value={form.clientRegistration.authorizedInstructions.agentCode}
                          path="clientRegistration.authorizedInstructions.agentCode"
                          onChange={(e) => update("clientRegistration.authorizedInstructions.agentCode", e.target.value)}
                          placeholder="Agent code"
                        />
                      </Field>
                      </div>
                    </div>
                  </div>

                  <br></br>
                  {/* PRIVACY CONSENT */}
                  {/* <SectionTitle className="uppercase tracking-wide">Privacy Notice & Data Collection Consent</SectionTitle>
                  <div className="mt-2 grid grid-cols-1 gap-3">
                    <CheckRow
                      checked={!!form.clientRegistration.privacyConsent.consentDataProcessing}
                      onChange={(v) => update("clientRegistration.privacyConsent.consentDataProcessing", v)}
                      label="I consent to the collection, processing, and storage of my personal data in accordance with the Company’s Privacy Policy."
                    />
                    <CheckRow
                      checked={!!form.clientRegistration.privacyConsent.consentThirdPartySharing}
                      onChange={(v) => update("clientRegistration.privacyConsent.consentThirdPartySharing", v)}
                      label="I agree to share my data with third-party service providers for specified operational purposes."
                    />
                    <CheckRow
                      checked={!!form.clientRegistration.privacyConsent.consentMarketing}
                      onChange={(v) => update("clientRegistration.privacyConsent.consentMarketing", v)}
                      label="I would like to receive promotional updates via email/SMS."
                    />
                  </div> */}

{/* OFFICE USE ONLY */}
                  <SectionTitle className="uppercase tracking-wide">Office Use Only</SectionTitle>
                  <div className="mt-2 rounded-3xl border border-zinc-200 bg-white/70 p-4 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/30">
<div className="grid grid-cols-1 gap-4">
                      <Field label="Application Received on">
                        <Input
                          type="date"
                          value={form.clientRegistration.officeUseOnly.applicationReceivedOn}
                          path="clientRegistration.officeUseOnly.applicationReceivedOn"
                          onChange={(e) => update("clientRegistration.officeUseOnly.applicationReceivedOn", e.target.value)}
                        />
                      </Field>

                      <Field label="Advisor’s Name">
                        <Select
                          value={form.clientRegistration.officeUseOnly.advisorsName}
                          path="clientRegistration.officeUseOnly.advisorsName"
                          onChange={(e) => update("clientRegistration.officeUseOnly.advisorsName", e.target.value)}
                        >
                          <option value="">Select</option>
                          <option value="Mr. Dimuthu Abeyesekera">Mr. Dimuthu Abeyesekera</option>
                          <option value="Mr. Upul Indrajith Priyantha">Mr. Upul Indrajith Priyantha</option>
                          <option value="Mr. Shanmugam Wickramasinghe">Mr. Shanmugam Wickramasinghe</option>
                          <option value="Mrs. Vasantha Wickramasinghe">Mrs. Vasantha Wickramasinghe</option>
                          <option value="Mrs. Nilmini Hapuarchchi">Mrs. Nilmini Hapuarchchi</option>
                          <option value="Mr. Gamage Jayarathne">Mr. Gamage Jayarathne</option>
                          <option value="Mr. Piyasage Ranasinghe">Mr. Piyasage Ranasinghe</option>
                          <option value="Mr. Buddika Jayasinghe">Mr. Buddika Jayasinghe</option>
                          <option value="Mrs. Chandrika Abeywickrama">Mrs. Chandrika Abeywickrama</option>
                          <option value="Mr. Nuwan Hewage">Mr. Nuwan Hewage</option>
                          <option value="Mr. Mohamed Assim Insaf">Mr. Mohamed Assim Insaf</option>
                          <option value="Mr. Janith Hettiarachchi">Mr. Janith Hettiarachchi</option>
                          <option value="Mr. Dhanushka Fernando">Mr. Dhanushka Fernando</option>
                          <option value="Mr. Vidura De Zoysa">Mr. Vidura De Zoysa</option>
                          <option value="Mr. Prasad Wijesinghe">Mr. Prasad Wijesinghe</option>
                          <option value="Mr. Nilum Samantha">Mr. Nilum Samantha</option>
                          <option value="Mr. Manoj Liyanapathirana">Mr. Manoj Liyanapathirana</option>
                          <option value="Mr. Sugath Siriwardana">Mr. Sugath Siriwardana</option>
                          <option value="Mr. Dinesh Delsi Ravinda">Mr. Dinesh Delsi Ravinda</option>
                          <option value="Mr. Mohamed Iliyas">Mr. Mohamed Iliyas</option>
                          <option value="Mr. Akila Sadun Ekanayake">Mr. Akila Sadun Ekanayake</option>
                          <option value="Mr. Prasanna Sujith Bandara Kangara">Mr. Prasanna Sujith Bandara Kangara</option>
                          <option value="Mr. Sanath Karunaweera">Mr. Sanath Karunaweera</option>
                          <option value="Mr. Nishantha Liyanarachchi">Mr. Nishantha Liyanarachchi</option>
                          <option value="Mr. Vinod Rajitha Ramanayake">Mr. Vinod Rajitha Ramanayake</option>
                          <option value="Mr. Muditha Dananjaya">Mr. Muditha Dananjaya</option>
                          <option value="Mr. Croos Christian Croos">Mr. Croos Christian Croos</option>
                          <option value="Mr. Isuru Poorna Premasiri">Mr. Isuru Poorna Premasiri</option>
                          <option value="Mr. Jeewana helage">Mr. Jeewana helage</option>
                          <option value="Mr. Ranjan Liyanage">Mr. Ranjan Liyanage</option>
                          <option value="Mr. Dilshan Fernando">Mr. Dilshan Fernando</option>
                          <option value="Mr. Ashan Chanaka">Mr. Ashan Chanaka</option>
                          <option value="Mr. Umayanga Rajamanthri">Mr. Umayanga Rajamanthri</option>
                        </Select>
                      </Field>

                      {/* <Field label="Advisor’s Signaturffe">
                        <FileUpload
                          label="Upload Signature"
                          file={liOfficeAdvisorSignature}
                          setFile={setLiOfficeAdvisorSignature}
                          path="uploads.liOfficeAdvisorSignature"
                          accept="image/*,application/pdf"
                        />
                      </Field> */}
                    </div>
                  </div>
                  
                  {/* CLIENT DECLARATION & AUTHORIZATION (NEW) */}
                  <SectionTitle className="uppercase tracking-wide">Client Declaration & Authorization</SectionTitle>
                  <div className="mt-2 rounded-3xl border border-zinc-200 bg-white/70 p-4 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/30">
                    {/* Declaration header block (as per form image) */}
                    <div className="mb-4 rounded-2xl border border-zinc-200 bg-gradient-to-br from-white/80 to-white/40 p-4 shadow-soft dark:border-zinc-800 dark:from-zinc-950/50 dark:to-zinc-950/20">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="text-sm font-semibold tracking-wide text-zinc-900 dark:text-zinc-100">ASHA SECURITIES LIMITED</div>
                          <div className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">No. 60, 5th Lane, Colombo 03.</div>
                          <div className="text-xs text-zinc-600 dark:text-zinc-400">Tel: +94 (011) 2429100&nbsp;&nbsp;&nbsp;Fax: +94 (011) 2429199</div>
                        </div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white/60 px-2 py-1 dark:border-zinc-800 dark:bg-zinc-950/40">
                            Client Details
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                          <span className="font-medium">I / We</span>
                          <div className="min-w-[220px] flex-1">
                            <Input
                              value={form.clientRegistration.clientDeclarationHeader?.declarantName || ""}
                              onChange={(e) => update("clientRegistration.clientDeclarationHeader.declarantName", e.target.value)}
                              placeholder=""
                            />
                          </div>
                          <span className="font-medium">bearing NIC No(s)</span>
                          <div className="min-w-[220px] flex-1">
                            <Input
                              value={form.clientRegistration.clientDeclarationHeader?.nicNos || ""}
                              onChange={(e) => update("clientRegistration.clientDeclarationHeader.nicNos", e.target.value)}
                              placeholder=""
                            />
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                          <span className="font-medium">CDS A/C No.</span>
                          <div className="min-w-[200px] flex-1">
                            <Input
                              value={form.clientRegistration.clientDeclarationHeader?.cdsAccountNo || ""}
                              onChange={(e) => update("clientRegistration.clientDeclarationHeader.cdsAccountNo", e.target.value)}
                              placeholder=""
                            />
                          </div>
                          <span className="font-medium">of</span>
                          <div className="min-w-[240px] flex-1">
                            <Input
                              value={form.clientRegistration.clientDeclarationHeader?.address || ""}
                              onChange={(e) => update("clientRegistration.clientDeclarationHeader.address", e.target.value)}
                              placeholder=""
                            />
                          </div>
                          <span className="font-medium">hereby declare that I / we aware of particulars given below.</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-700 leading-6 dark:text-zinc-300">
                      I / We undertake to operate my / our share trading account with ASHA SECURITIES LTD. (Hereinafter referred to as BROKER) in accordance with CSE Stock Broker Rule and other prevailing laws and regulations of Sri Lanka and in particular to the authority hereinafter granted by me / us to the Broker.
                    </p>
                    <br></br>

                    <p className="text-xs sm:text-sm text-zinc-700 leading-6 dark:text-zinc-300">
                      In the event of my / our failure to settle the amounts due in respect of a share purchase, I / we do hereby irrevocably authorize the Broker to sell such securities involved in the default and if such proceeds are inadequate to cover the shortfall and any loss incurred by the Broker, to sell any other security in my / our portfolio held by the Broker in the Central Depository Systems (Pvt) Ltd., so that the full amount due to the Broker may be settled and any surplus arising on the sale of shares shall accrue to the Broker unless such surplus arise from the sale of other quoted shares deposited by the buyer as collateral with broker in which event the surplus shall be remitted to after settlement day of the relevant sale(s).
                    </p>
                    <br></br>

                    <p className="text-xs sm:text-sm text-zinc-700 leading-6 dark:text-zinc-300">
                      The funds to be invested for the purchase of Securities through the Securities Account to be opened with the CDS will not be funds derived from any money laundering activity or funds generated through financing of terrorist or any other illegal activity.
                    </p>
                    <br></br>

                    <p className="text-xs sm:text-sm text-zinc-700 leading-6 dark:text-zinc-300">
                      In the event of a variation of any information given in the CDS Form 1, Addendum to CDS Form 1 (A) this declaration and other information submitted by me / us along with the application to open a CDS Account, I / we undertake to inform the CDS in writing within fourteen (14) days of such variation.
                    </p>
                    <br></br>

                    <p className="text-xs sm:text-sm text-zinc-700 leading-6 dark:text-zinc-300">
                      Change of Broker Material Information (Ownership / Address) will be notified over public notice in printed Media.
                    </p>
                    <br></br>

                    <p className="text-xs sm:text-sm text-zinc-700 leading-6 dark:text-zinc-300">
                      The irrevocable authority granted hereby shall in no way effect or exempt me / us from any liability as stated herein towards the BROKER arising from or consequent upon any such default.
                    </p>
                    <br></br>

                    <p className="text-xs sm:text-sm text-zinc-700 leading-6 dark:text-zinc-300">
                      Also I / we do hereby irrevocably agree that in the event of any purchase orders placed with you for the purchase of shares, I / we shall pay approximately 50% of the value of such purchase by a legal tender which amount shall be set off against the total amount due from me / us to you on the due date of settlement in respect of such purchases, and the relevant investment advisors may be incentiviced by the company on such purchase and sales turnovers.
                    </p>
                    <br></br>

                    <p className="text-xs sm:text-sm text-zinc-700 leading-6 dark:text-zinc-300">
                      Any delayed payments will be subject to additional interest cost on the consideration and will be debited to my / our account. Interest percentage will be decided by the Broker considering the prevailing interest rates. (not exceeding a maximum interest rate of 0.1% per day)
                    </p>
                    <br></br>

                    <p className="text-xs sm:text-sm text-zinc-700 leading-6 dark:text-zinc-300">
                      The risk disclosure statement was explained while advising independently and was invited to read and ask questions.
                    </p>
                    <br></br>

                    <p className="text-xs sm:text-sm text-zinc-700 leading-6 dark:text-zinc-300">
                      Services provided: - Online Facility, Research Reports.
                    </p>
                    <br></br>

                    {/* <ul className="mt-3 list-disc pl-5 text-xs sm:text-sm text-zinc-700 space-y-2 dark:text-zinc-300">
                      <li>
                        In the event of failure to settle amounts due in respect of a share purchase, I / we irrevocably
                        authorize the Broker to sell securities involved in the default and/or any other security in my / our
                        portfolio as permitted, to settle the full amount due.
                      </li>
                      <li>
                        The funds to be invested will not be derived from any money laundering activity, terrorist financing,
                        or any other illegal activity.
                      </li>
                      <li>
                        I / We undertake to inform CDS in writing within fourteen (14) days of any variation of information
                        submitted with this application.
                      </li>
                      <li>
                        Any delayed payments will be subject to additional interest cost on the consideration (not exceeding
                        0.1% per day), as decided by the Broker considering prevailing interest rates.
                      </li>
                      <li>
                        The risk disclosure statement was explained while advising independently, and I / we were invited to read
                        and ask questions. Services provided may include: Online Facility, Research Reports.
                      </li>
                    </ul> */}

                    {/* REMARKS (new layout to match the latest Word/PDF) */}
                    <div className="mt-4 rounded-2xl border border-zinc-200 bg-white/60 p-4 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/25">
                      <div className="text-sm font-semibold text-zinc-900 underline underline-offset-4 dark:text-zinc-100">
                        Remarks:
                      </div>

                      {(() => {
                        const visited = String(form.clientRegistration.clientDeclaration.clientVisitedOffice || "") === "Yes";
                        return (
                          <>
                            <div className="mt-3 flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={visited}
                                onChange={(e) => {
                                  const next = e.target.checked;
                                  update(
                                    "clientRegistration.clientDeclaration.clientVisitedOffice",
                                    next ? "Yes" : ""
                                  );
                                  if (!next) {
                                    update("clientRegistration.clientDeclaration.visitedOfficeOn", "");
                                  }
                                }}
                                className="h-5 w-5 rounded-md border border-zinc-400 bg-white/80 text-zinc-900 accent-zinc-900 shadow-sm transition focus:ring-2 focus:ring-black/20 dark:border-zinc-600 dark:bg-zinc-900/60 dark:accent-white"
                              />
                              <span className="text-sm text-zinc-700 dark:text-zinc-300">
                                Client has visited the office
                              </span>
                            </div>

                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Field label="If Yes, on">
                                <Input
                                  type="date"
                                  disabled={!visited}
                                  value={form.clientRegistration.clientDeclaration.visitedOfficeOn}
                                  path="clientRegistration.clientDeclaration.visitedOfficeOn"
                                  onChange={(e) => update("clientRegistration.clientDeclaration.visitedOfficeOn", e.target.value)}
                                  placeholder="dd/MM/yyyy"
                                />
                              </Field>

                              <div className="md:col-span-2">
                              <Field label="Name of the Staff Member">
                                <Input
                                  value={form.clientRegistration.clientDeclaration.staffMemberName}
                                  path="clientRegistration.clientDeclaration.staffMemberName"
                                  onChange={(e) => update("clientRegistration.clientDeclaration.staffMemberName", e.target.value)}
                                  placeholder="Enter Staff Member Name"
                                />
                              </Field>
                              </div>

                              <div className="md:col-span-2">
                                <Field label="Authorize Signature">
                                  <Input
                                    value={form.clientRegistration.clientDeclaration.authorizeName || ""}
                                    path="clientRegistration.clientDeclaration.authorizeName"
                                    onChange={(e) => update("clientRegistration.clientDeclaration.authorizeName", e.target.value)}
                                    placeholder="Enter Authorize Signature"
                                  />
                                </Field>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* KNOW YOUR CUSTOMER (KYC) PROFILE */}
                  <div className="mt-6 rounded-3xl border border-zinc-200 bg-white/70 p-5 shadow-soft backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/35">
                    <div className="flex flex-col gap-1">
                      <div className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                        KNOW YOUR CUSTOMER (KYC) PROFILE
                      </div>
                      {/* <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                        Please mark with a ✓ where applicable. Joint holder columns will be enabled only if Joint Applicants are added.
                      </div> */}
                    </div>

                    {(() => {
                      const holders = [
                        { key: "main", label: "Main Holder", enabled: true },
                        { key: "joint1", label: "1st Joint Holder", enabled: jointEnabled },
                        { key: "joint2", label: "2nd Joint Holder", enabled: secondJointEnabled },
                      ];

                      const CellCheck = ({ path, disabled }) => (
                        <div className="flex justify-center">
                          <input
                            type="checkbox"
                            disabled={disabled}
                            checked={!!getByPath(form, path)}
                            onChange={(e) => update(path, e.target.checked)}
                            className={`h-5 w-5 rounded-md border border-zinc-400 bg-white/80 text-zinc-900 accent-zinc-900 shadow-sm transition focus:ring-2 focus:ring-black/20 dark:border-zinc-600 dark:bg-zinc-900/60 dark:accent-white ${
                              disabled ? "opacity-40 cursor-not-allowed" : ""
                            }`}
                          />
                        </div>
                      );

                      const Row = ({ label, basePath }) => (
                        <div className="grid grid-cols-[minmax(0,1fr)_repeat(3,110px)] gap-2 items-center py-2 border-b border-zinc-200/70 last:border-b-0 dark:border-zinc-800/60">
                          <div className="text-sm text-zinc-700 dark:text-zinc-300">{label}</div>
                          {holders.map((h) => (
                            <CellCheck
                              key={h.key}
                              path={`${basePath}.${h.key}`}
                              disabled={!h.enabled}
                            />
                          ))}
                        </div>
                      );

                      const SectionHeader = ({ n, title, note }) => (
                        <div className="mt-6">
                          <div className="flex items-start justify-between gap-3">
                            <div className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100">
                              {n}. {title}
                            </div>
                            {note ? (
                              <div className="text-xs text-zinc-500 dark:text-zinc-400">{note}</div>
                            ) : null}
                          </div>
                          <div className="mt-2 grid grid-cols-[minmax(0,1fr)_repeat(3,110px)] gap-2">
                            <div />
                            {holders.map((h) => (
                              <div
                                key={h.key}
                                className={`text-xs font-medium text-center rounded-xl border px-2 py-1 ${
                                  h.enabled
                                    ? "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300"
                                    : "border-zinc-200/70 bg-zinc-50/40 text-zinc-400 dark:border-zinc-800/50 dark:bg-zinc-900/20 dark:text-zinc-500"
                                }`}
                              >
                                {h.label}
                              </div>
                            ))}
                          </div>
                        </div>
                      );

                      const YesNo = ({ label, pathBase }) => (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                          <div className="md:col-span-1">
                            <div className="text-sm text-zinc-700 dark:text-zinc-300">{label}</div>
                          </div>
                          {holders.map((h) => (
                            <div key={h.key} className="md:col-span-1">
                              <Select
                                value={getByPath(form, `${pathBase}.${h.key}`) || ""}
                                onChange={(e) => update(`${pathBase}.${h.key}`, e.target.value)}
                                disabled={!h.enabled}
                              >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </Select>
                            </div>
                          ))}
                        </div>
                      );

                      // FATCA (Yes/No) matrix styled like the paper form (checkboxes per holder)
                      const FatcaMatrix = ({ pathBase }) => {
                        const toggle = (holderKey, val, enabled) => {
                          if (!enabled) return;
                          const cur = getByPath(form, `${pathBase}.${holderKey}`) || "";
                          update(`${pathBase}.${holderKey}`, cur === val ? "" : val);
                        };

                        
const Cell = ({ holderKey, enabled, val }) => {
  const checked = (getByPath(form, `${pathBase}.${holderKey}`) || "") === val;
  return (
    <div className="flex items-center justify-center py-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => toggle(holderKey, val, enabled)}
        disabled={!enabled}
        aria-label={`${holderKey} ${val}`}
        className={`h-5 w-5 rounded-[4px] border transition focus:outline-none focus:ring-0 ${
          enabled
            ? "border-zinc-400 bg-white/70 text-zinc-900 hover:bg-white dark:border-zinc-600 dark:bg-zinc-950/30 dark:text-zinc-100"
            : "cursor-not-allowed border-zinc-300 bg-zinc-100 text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900/20"
        }`}
      />
    </div>
  );
};

                        return (
                          <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
                            {/* Header */}
                            <div className="grid grid-cols-[minmax(0,1fr)_repeat(3,110px)]">
                              <div className="bg-zinc-50/80 px-3 py-2 text-xs font-semibold text-zinc-700 dark:bg-zinc-900/35 dark:text-zinc-300" />
                              {holders.map((h) => (
                                <div
                                  key={h.key}
                                  className={`flex items-center justify-center border-l border-zinc-200 bg-zinc-50/80 px-2 py-2 text-xs font-semibold dark:border-zinc-800 dark:bg-zinc-900/35 ${
                                    h.enabled ? "text-zinc-700 dark:text-zinc-300" : "text-zinc-400 dark:text-zinc-500"
                                  }`}
                                >
                                  {h.label}
                                </div>
                              ))}
                            </div>

                            {/* YES row */}
                            <div className="grid grid-cols-[minmax(0,1fr)_repeat(3,110px)]">
                              <div className="px-3 py-3 text-sm text-zinc-900 dark:text-zinc-100">
                                <span className="font-medium">Yes</span>
                                <span className="text-zinc-600 dark:text-zinc-400"> (If yes, FATCA declaration has to be submitted along with application form)</span>
                              </div>
                              {holders.map((h) => (
                                <div key={h.key} className="border-l border-zinc-200 py-2 dark:border-zinc-800">
                                  <Cell holderKey={h.key} enabled={h.enabled} val="Yes" />
                                </div>
                              ))}
                            </div>

                            {/* NO row */}
                            <div className="grid grid-cols-[minmax(0,1fr)_repeat(3,110px)] border-t border-zinc-200 dark:border-zinc-800">
                              <div className="px-3 py-3 text-sm text-zinc-900 dark:text-zinc-100">
                                <span className="font-medium">No</span>
                                <span className="text-zinc-600 dark:text-zinc-400"> (In the event if I/We become a US person under FATCA of US, I/We do hereby undertake to inform the said fact to the Participant immediately)</span>
                              </div>
                              {holders.map((h) => (
                                <div key={h.key} className="border-l border-zinc-200 py-2 dark:border-zinc-800">
                                  <Cell holderKey={h.key} enabled={h.enabled} val="No" />
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      };

                      const InvestmentSelect = ({ pathBase }) => (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {holders.map((h) => (
                            <Field key={h.key} label={h.label}>
                              <Select
                                value={getByPath(form, `${pathBase}.${h.key}`) || ""}
                                onChange={(e) => update(`${pathBase}.${h.key}`, e.target.value)}
                                disabled={!h.enabled}
                              >
                                <option value="">Select</option>
                                <option value="Less than Rs. 100,000">Less than Rs. 100,000</option>
                                <option value="Rs 100,000 to Rs 500,000">Rs 100,000 to Rs 500,000</option>
                                <option value="Rs 500,000 to Rs 1,000,000">Rs 500,000 to Rs 1,000,000</option>
                                <option value="Rs 1,000,000 to Rs 2,000,000">Rs 1,000,000 to Rs 2,000,000</option>
                                <option value="Rs 2,000,000 to Rs 3,000,000">Rs 2,000,000 to Rs 3,000,000</option>
                                <option value="Rs 3,000,000 to Rs 4,000,000">Rs 3,000,000 to Rs 4,000,000</option>
                                <option value="Rs 4,000,000 to Rs 5,000,000">Rs 4,000,000 to Rs 5,000,000</option>
                                <option value="Rs 5,000,000 to Rs 10,000,000">Rs 5,000,000 to Rs 10,000,000</option>
                                <option value="Over Rs 10,000,000">Over Rs 10,000,000</option>
                              </Select>
                            </Field>
                          ))}
                        </div>
                      );

                      const RiskSelect = ({ pathBase }) => (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {holders.map((h) => (
                            <Field key={h.key} label={h.label}>
                              <Select
                                value={getByPath(form, `${pathBase}.${h.key}`) || ""}
                                onChange={(e) => update(`${pathBase}.${h.key}`, e.target.value)}
                                disabled={!h.enabled}
                              >
                                <option value="">Select</option>
                                <option value="L">L</option>
                                <option value="M">M</option>
                                <option value="H">H</option>
                              </Select>
                            </Field>
                          ))}
                        </div>
                      );

                      // Dual-citizenship Details (PDF-style table layout)
                      // NOTE:
                      // This is intentionally written as a render helper instead of a nested React component.
                      // The previous {renderDualCitizenshipTable()} + <Row /> component pattern caused the input rows
                      // to remount on every keystroke, which made the page jump/scroll and broke continuous typing.
                      const renderDualCitizenshipTable = () => {
                        const selBase = `clientRegistration.kycProfile.dualCitizenshipSelection`;
                        const enabledHolders = holders.filter((h) => h.enabled).map((h) => h.key);
                        const fallbackHolder = enabledHolders[0] || "main";

                        const currentSel = (rowIdx) => String(getByPath(form, `${selBase}.${rowIdx}`) || "");
                        const isSelected = (rowIdx, holderKey) => currentSel(rowIdx) === holderKey;

                        const setSelected = (rowIdx, holderKey) => {
                          const cur = currentSel(rowIdx);
                          update(`${selBase}.${rowIdx}`, cur === holderKey ? "" : holderKey);
                        };

                        const activeHolderForRow = (rowIdx) => {
                          const cur = currentSel(rowIdx);
                          if (cur && holders.find((h) => h.key === cur)?.enabled) return cur;
                          return fallbackHolder;
                        };

                        const onInputChange = (rowIdx, field, value) => {
                          const cur = currentSel(rowIdx);
                          const holderKey = cur || activeHolderForRow(rowIdx);
                          if (!cur) update(`${selBase}.${rowIdx}`, holderKey);
                          update(`clientRegistration.kycProfile.dualCitizenship.${holderKey}.${rowIdx}.${field}`, value);
                        };

                        return (
                          <div className="mt-3 rounded-2xl border border-zinc-200 bg-white/60 overflow-hidden dark:border-zinc-800 dark:bg-zinc-950/25">
                            <div className="grid grid-cols-[minmax(0,1fr)_100px_100px_100px]">
                              <div className="border-b border-r border-zinc-200 bg-zinc-50/70 px-3 py-2 text-sm font-semibold text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/25 dark:text-zinc-100">
                                Dual-citizenship Details
                              </div>
                              {holders.map((h) => (
                                <div
                                  key={`dualHead_${h.key}`}
                                  className={`border-b border-r last:border-r-0 border-zinc-200 bg-zinc-50/70 px-2 py-2 text-center text-xs font-semibold dark:border-zinc-800 dark:bg-zinc-900/25 ${
                                    h.enabled
                                      ? "text-zinc-700 dark:text-zinc-300"
                                      : "text-zinc-400 dark:text-zinc-500"
                                  }`}
                                >
                                  {h.label}
                                </div>
                              ))}
                            </div>

                            {[0, 1, 2].map((idx) => {
                              const holderKey = activeHolderForRow(idx);
                              const enabled = holders.find((h) => h.key === holderKey)?.enabled;
                              const countryVal =
                                getByPath(form, `clientRegistration.kycProfile.dualCitizenship.${holderKey}.${idx}.country`) || "";
                              const passVal =
                                getByPath(form, `clientRegistration.kycProfile.dualCitizenship.${holderKey}.${idx}.passportNo`) || "";

                              return (
                                <div key={`dual_row_${idx}`} className="grid grid-cols-[minmax(0,1fr)_100px_100px_100px]">
                                  <div className="border-b border-r border-zinc-200 px-3 py-3 dark:border-zinc-800">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      <Field label={`Country ${idx + 1}`}>
                                        <Input
                                          value={countryVal}
                                          onChange={(e) => onInputChange(idx, "country", e.target.value)}
                                          disabled={!enabled}
                                          placeholder="Country"
                                        />
                                      </Field>
                                      <Field label="Passport No.">
                                        <Input
                                          value={passVal}
                                          onChange={(e) => onInputChange(idx, "passportNo", e.target.value)}
                                          disabled={!enabled}
                                          placeholder="Passport No."
                                        />
                                      </Field>
                                    </div>
                                  </div>

                                  {holders.map((h) => (
                                    <div
                                      key={`dual_sel_${idx}_${h.key}`}
                                      className="border-b border-r last:border-r-0 border-zinc-200 px-2 py-3 flex items-center justify-center dark:border-zinc-800"
                                    >
                                      <input
                                        type="checkbox"
                                        disabled={!h.enabled}
                                        checked={isSelected(idx, h.key)}
                                        onChange={() => setSelected(idx, h.key)}
                                        className={`h-5 w-5 rounded border-zinc-400 accent-red-600 dark:border-zinc-600 dark:accent-red-500 ${
                                          !h.enabled ? "opacity-40" : ""
                                        }`}
                                      />
                                    </div>
                                  ))}
                                </div>
                              );
                            })}
                          </div>
                        );
                      };

                      return (
                        <>
                          {/* 1. Documents Provided */}
                          <SectionHeader n="1" title="Documents Provided" />

                          <div className="mt-3 rounded-2xl border border-zinc-200 bg-white/60 overflow-hidden dark:border-zinc-800 dark:bg-zinc-950/25">
                            {/* Header row */}
                            <div className="grid grid-cols-[minmax(0,1fr)_100px_100px_100px]">
                              <div className="border-b border-r border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-900 dark:border-zinc-800 dark:text-zinc-100">
                                KYC
                              </div>
                              {holders.map((h) => (
                                <div
                                  key={`docHead_${h.key}`}
                                  className={`border-b border-r last:border-r-0 border-zinc-200 px-2 py-2 text-center text-xs font-semibold dark:border-zinc-800 ${
                                    h.enabled
                                      ? "text-zinc-700 dark:text-zinc-300"
                                      : "text-zinc-400 dark:text-zinc-500"
                                  }`}
                                >
                                  {h.label}
                                </div>
                              ))}
                            </div>

                            {/* KYC rows */}
                            {[
                              ["National Identity Card", "clientRegistration.kycProfile.documentsProvided.forKyc.nationalIdentityCard"],
                              ["Passport", "clientRegistration.kycProfile.documentsProvided.forKyc.passport"],
                              [
                                "Driving License",
                                "clientRegistration.kycProfile.documentsProvided.forKyc.drivingLicense",
                                "An Affidavit is required confirming the fact that both NIC / Passport are not available."
                              ],
                            ].map(([label, basePath, note]) => (
                              <div key={basePath} className="grid grid-cols-[minmax(0,1fr)_100px_100px_100px]">
                                <div className="border-b border-r border-zinc-200 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
                                  <div>{label}</div>
                                  {note ? (
                                    <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                      ({note})
                                    </div>
                                  ) : null}
                                </div>
                                {holders.map((h) => (
                                  <div
                                    key={`${basePath}.${h.key}`}
                                    className="border-b border-r last:border-r-0 border-zinc-200 px-2 py-2 dark:border-zinc-800"
                                  >
                                    <CellCheck path={`${basePath}.${h.key}`} disabled={!h.enabled} />
                                  </div>
                                ))}
                              </div>
                            ))}

                            {/* Row: Proof of Residency (styled like other rows; not bold) */}
                            <div className="grid grid-cols-[minmax(0,1fr)_100px_100px_100px]">
                              <div className="border-b border-r border-zinc-200 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
                                Proof of Residency
                              </div>
                              {holders.map((h) => (
                                <div
                                  key={`proofSection.${h.key}`}
                                  className="border-b border-r last:border-r-0 border-zinc-200 px-2 py-2 dark:border-zinc-800"
                                >
                                  <CellCheck
                                    path={`clientRegistration.kycProfile.documentsProvided.proofOfResidency.section.${h.key}`}
                                    disabled={!h.enabled}
                                  />
                                </div>
                              ))}
                            </div>

                            {/* Proof of Residency rows */}
                            {[
                              ["National Identity Card", "clientRegistration.kycProfile.documentsProvided.proofOfResidency.nationalIdentityCard"],
                              ["Bank/ Credit card Statement", "clientRegistration.kycProfile.documentsProvided.proofOfResidency.bankOrCreditCardStatement"],
                              ["Telephone Bill", "clientRegistration.kycProfile.documentsProvided.proofOfResidency.telephoneBill"],
                              ["Electricity/Water Bill", "clientRegistration.kycProfile.documentsProvided.proofOfResidency.electricityWaterBill"],
                              ["Registered Lease Agreement", "clientRegistration.kycProfile.documentsProvided.proofOfResidency.registeredLeaseAgreement"],
                              ["Gramasevaka Certificate certified by the Divisional Secretary", "clientRegistration.kycProfile.documentsProvided.proofOfResidency.gramasevakaCertificate"],
                              [
                                "Letter issued by superintendent of a plantation estate in respect of estate workers who have no other documentary proof.",
                                "clientRegistration.kycProfile.documentsProvided.proofOfResidency.plantationSuperintendentLetter",
                              ],
                              ["Any Other Document (Please Specify)", "clientRegistration.kycProfile.documentsProvided.proofOfResidency.anyOther"],
                            ].map(([label, basePath]) => (
                              <div key={basePath} className="grid grid-cols-[minmax(0,1fr)_100px_100px_100px]">
                                <div className="border-b border-r border-zinc-200 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
                                  {label}
                                </div>
                                {holders.map((h) => (
                                  <div
                                    key={`${basePath}.${h.key}`}
                                    className="border-b border-r last:border-r-0 border-zinc-200 px-2 py-2 dark:border-zinc-800"
                                  >
                                    <CellCheck path={`${basePath}.${h.key}`} disabled={!h.enabled} />
                                  </div>
                                ))}
                              </div>
                            ))}

                            {/* Specify row for Any Other Document */}
                            <div className="grid grid-cols-[minmax(0,1fr)_100px_100px_100px]">
                              <div className="border-r border-zinc-200 px-3 py-3 dark:border-zinc-800">
                                <Input
                                  value={getByPath(form, "clientRegistration.kycProfile.documentsProvided.proofOfResidency.anyOther.specify") || ""}
                                  onChange={(e) => update("clientRegistration.kycProfile.documentsProvided.proofOfResidency.anyOther.specify", e.target.value)}
                                  placeholder="Please specify"
                                />
                              </div>
                              <div className="border-r border-zinc-200 dark:border-zinc-800" />
                              <div className="border-r border-zinc-200 dark:border-zinc-800" />
                              <div />
                            </div>

                            <div className="px-3 py-2 text-xs text-zinc-500 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-800">
                              Note: These documents should be within (3) months as of the date of submission of the CDS Account opening form.
                            </div>
                          </div>

                          {/* 2. Status of Residency Address */}
                          <SectionHeader n="2" title="Status of Residency Address (Premises)" />
                          <div className="mt-3 rounded-2xl border border-zinc-200 bg-white/60 p-4 dark:border-zinc-800 dark:bg-zinc-950/25">
                            <Row label="Owner" basePath="clientRegistration.kycProfile.residencyAddressStatus.owner" />
                            <Row label="With parents" basePath="clientRegistration.kycProfile.residencyAddressStatus.withParents" />
                            <Row label="Lease / Rent" basePath="clientRegistration.kycProfile.residencyAddressStatus.leaseRent" />
                            <Row label="Friend’s / Relative’s" basePath="clientRegistration.kycProfile.residencyAddressStatus.friendsRelatives" />
                            <Row label="Board / Lodging" basePath="clientRegistration.kycProfile.residencyAddressStatus.boardLodging" />
                            <Row label="Official" basePath="clientRegistration.kycProfile.residencyAddressStatus.official" />
                            <Row label="Other places (Please specify)" basePath="clientRegistration.kycProfile.residencyAddressStatus.otherPlaces" />
                            <div className="pt-3">
                              <Field label="Other places - specify">
                                <Input
                                  value={getByPath(form, "clientRegistration.kycProfile.residencyAddressStatus.otherPlaces.specify") || ""}
                                  onChange={(e) => update("clientRegistration.kycProfile.residencyAddressStatus.otherPlaces.specify", e.target.value)}
                                  placeholder="Specify"
                                />
                              </Field>
                            </div>
                          </div>

                          {/* 3. Dual citizenship details */}
                          <SectionHeader n="3" title="Dual-citizenship Details" />
                          {renderDualCitizenshipTable()}

                          {/* 4. FATCA */}
                          <SectionHeader n="4" title="Are you a US person under the Foreign Account Tax Compliance Act (FATCA) of the US?" />
                          <div className="mt-3 rounded-2xl border border-zinc-200 bg-white/60 p-4 dark:border-zinc-800 dark:bg-zinc-950/25">
                            {/* <div className="text-sm text-zinc-700 dark:text-zinc-300">Please tick the relevant option for each holder.</div> */}
                            <div className="mt-3">
                              <FatcaMatrix pathBase="clientRegistration.kycProfile.fatcaUsPerson" />
                            </div>
                          </div>

                          {/* 5. Employment */}
                          <SectionHeader n="5" title="Employment" />
                          <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {holders.map((h) => (
                              <div
                                key={h.key}
                                className={`rounded-2xl border border-zinc-200 bg-white/60 p-4 dark:border-zinc-800 dark:bg-zinc-950/25 ${
                                  !h.enabled ? "opacity-50" : ""
                                }`}
                              >
                                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{h.label}</div>

                                <div className="mt-3 grid grid-cols-1 gap-3">
                                  <Field label="Status">
                                    <Select
                                      value={getByPath(form, `clientRegistration.kycProfile.employment.${h.key}.status`) || ""}
                                      onChange={(e) => update(`clientRegistration.kycProfile.employment.${h.key}.status`, e.target.value)}
                                      disabled={!h.enabled}
                                    >
                                      <option value="">Select</option>
                                      <option value="Employed">Employed</option>
                                      <option value="Self Employed">Self Employed</option>
                                    </Select>
                                  </Field>

                                  <Field label="Occupation / Nature of Business">
                                    <Input
                                      value={getByPath(form, `clientRegistration.kycProfile.employment.${h.key}.occupationNature`) || ""}
                                      onChange={(e) => update(`clientRegistration.kycProfile.employment.${h.key}.occupationNature`, e.target.value)}
                                      disabled={!h.enabled}
                                      placeholder="Occupation / Nature of Business"
                                    />
                                  </Field>

                                  <Field label="Name of the Business / Organization">
                                    <Input
                                      value={getByPath(form, `clientRegistration.kycProfile.employment.${h.key}.businessOrganizationName`) || ""}
                                      onChange={(e) => update(`clientRegistration.kycProfile.employment.${h.key}.businessOrganizationName`, e.target.value)}
                                      disabled={!h.enabled}
                                      placeholder="Business / Organization"
                                    />
                                  </Field>

                                  <Field label="Office Address">
                                    <Input
                                      value={getByPath(form, `clientRegistration.kycProfile.employment.${h.key}.officeAddress`) || ""}
                                      onChange={(e) => update(`clientRegistration.kycProfile.employment.${h.key}.officeAddress`, e.target.value)}
                                      disabled={!h.enabled}
                                      placeholder="Office Address"
                                    />
                                  </Field>

                                  <div className="grid grid-cols-1 gap-3">
                                    <Field label="Telephone">
                                      <div className="w-full">
                                        <PhoneInput
                                          path={`clientRegistration.kycProfile.employment.${h.key}.telephone`}
                                          value={getByPath(form, `clientRegistration.kycProfile.employment.${h.key}.telephone`) || ""}
                                          onChange={(v) => update(`clientRegistration.kycProfile.employment.${h.key}.telephone`, v)}
                                          disabled={!h.enabled}
                                          placeholder="Telephone"
                                        />
                                      </div>
                                    </Field>
                                  </div>

                                  <div className="mt-3 grid grid-cols-1 gap-3">
                                    <Field label="Fax">
                                      <Input
                                        value={getByPath(form, `clientRegistration.kycProfile.employment.${h.key}.fax`) || ""}
                                        onChange={(e) => update(`clientRegistration.kycProfile.employment.${h.key}.fax`, e.target.value)}
                                        disabled={!h.enabled}
                                        placeholder="Fax"
                                      />
                                    </Field>
                                  </div>

                                  <Field label="E-mail">
                                    <Input
                                      value={getByPath(form, `clientRegistration.kycProfile.employment.${h.key}.email`) || ""}
                                      onChange={(e) => update(`clientRegistration.kycProfile.employment.${h.key}.email`, e.target.value)}
                                      disabled={!h.enabled}
                                      placeholder="E-mail"
                                    />
                                  </Field>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* 6. Expected value of investment */}
                          <SectionHeader n="6" title="Expected Value of Investment per annum" />
                          <div className="mt-3 rounded-2xl border border-zinc-200 bg-white/60 p-4 dark:border-zinc-800 dark:bg-zinc-950/25">
                            <InvestmentSelect pathBase="clientRegistration.kycProfile.expectedInvestmentPerAnnum" />
                          </div>

                          {/* 7. Source of funds */}
                          <SectionHeader n="7" title="Source of funds" />
                          <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <SourceFundsCard holderKey="main" label="Main Holder" enabled={holders.find(h => h.key === "main")?.enabled} form={form} update={update} />
                            <SourceFundsCard holderKey="joint1" label="1st Joint Holder" enabled={holders.find(h => h.key === "joint1")?.enabled} form={form} update={update} />
                            <SourceFundsCard holderKey="joint2" label="2nd Joint Holder" enabled={holders.find(h => h.key === "joint2")?.enabled} form={form} update={update} />
                          </div>

                          {/* 8. Other connected businesses */}
                          <SectionHeader n="8" title="Any other connected Businesses / Professional activities" />
                          <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {holders.map((h) => (
                              <div
                                key={h.key}
                                className={`rounded-2xl border border-zinc-200 bg-white/60 p-4 dark:border-zinc-800 dark:bg-zinc-950/25 ${
                                  !h.enabled ? "opacity-50" : ""
                                }`}
                              >
                                <Field label={h.label}>
                                  <textarea
                                    value={getByPath(form, `clientRegistration.kycProfile.otherConnectedBusinesses.${h.key}`) || ""}
                                    onChange={(e) => update(`clientRegistration.kycProfile.otherConnectedBusinesses.${h.key}`, e.target.value)}
                                    disabled={!h.enabled}
                                    placeholder="Type here..."
                                    className="min-h-[90px] w-full rounded-2xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-zinc-900 shadow-soft outline-none transition focus:ring-2 focus:ring-black/20 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-white"
                                  />
                                </Field>
                              </div>
                            ))}
                          </div>

                          {/* 9. PEPs */}
                          <SectionHeader n="9" title="Politically Exposed Persons (PEPs)" />
                          <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <PepBlockCard holderKey="main" label="Main Holder" enabled={holders.find(h => h.key === "main")?.enabled} form={form} update={update} />
                            <PepBlockCard holderKey="joint1" label="1st Joint Holder" enabled={holders.find(h => h.key === "joint1")?.enabled} form={form} update={update} />
                            <PepBlockCard holderKey="joint2" label="2nd Joint Holder" enabled={holders.find(h => h.key === "joint2")?.enabled} form={form} update={update} />
                          </div>

                          {/* 10. Risk Categorization */}
                          <SectionHeader n="10" title="Risk Categorization (Office use only)" />
                          <div className="mt-3 rounded-2xl border border-zinc-200 bg-white/60 p-4 dark:border-zinc-800 dark:bg-zinc-950/25">
                            <RiskSelect pathBase="clientRegistration.kycProfile.riskCategorizationOfficeUse" />
                          </div>

                          {/* 11. Authorized persons */}
                          <SectionHeader n="11" title="Name of the person(s) authorized to give instructions to the Participant" note="" />
                          <div className="mt-3 rounded-2xl border border-zinc-200 bg-white/60 p-4 dark:border-zinc-800 dark:bg-zinc-950/25">
                            <Field label="">
                              <textarea
                                value={getByPath(form, "clientRegistration.kycProfile.authorizedToGiveInstructions") || ""}
                                onChange={(e) => update("clientRegistration.kycProfile.authorizedToGiveInstructions", e.target.value)}
                                placeholder=""
                                className="min-h-[90px] w-full rounded-2xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-zinc-900 shadow-soft outline-none transition focus:ring-2 focus:ring-black/20 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-white"
                              />
                            </Field>
                            <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
                              Please Attach a duly certified copy of Power of Attorney if applicable.
                            </div>
                            <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
                              Participant means your Stockbroker or Custodian Bank.
                            </div>
                          </div>

                          {/* 12. Other remarks */}
                          <SectionHeader n="12" title="Other remarks / notes (if any)" />
                          <div className="mt-3 rounded-2xl border border-zinc-200 bg-white/60 p-4 dark:border-zinc-800 dark:bg-zinc-950/25">
                            <textarea
                              value={getByPath(form, "clientRegistration.kycProfile.otherRemarksNotes") || ""}
                              onChange={(e) => update("clientRegistration.kycProfile.otherRemarksNotes", e.target.value)}
                              placeholder="Type here..."
                              className="min-h-[90px] w-full rounded-2xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-zinc-900 shadow-soft outline-none transition focus:ring-2 focus:ring-black/20 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-white"
                            />
                          </div>
                        </>
                      );
                    })()}
                  
                  {/* CLIENT AGREEMENT (New Section) */}
                  <div className="mt-6 rounded-3xl border border-zinc-200 bg-white/70 p-5 shadow-soft backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/35">
                    <div className="flex flex-col gap-1">
                      <div className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                        CLIENT AGREEMENT
                      </div>
                      {/* <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                        Fill the boxes like the paper agreement. Joint holder rows will be enabled only if Joint Applicants are added.
                      </div> */}
                    </div>

                    {(() => {
                      const ca = form?.clientRegistration?.clientAgreement || {};
                      const date = ca?.date || {};
                      const parties = Array.isArray(ca?.parties) ? ca.parties : [{}, {}, {}];

                      const setAgreementDate = (part, value) => {
                        update(`clientRegistration.clientAgreement.date.${part}`, clampAgreementDatePart(part, value));
                      };

                      const finalizeAgreementDate = (part) => {
                        const currentValue = getByPath(form, `clientRegistration.clientAgreement.date.${part}`) || "";
                        update(`clientRegistration.clientAgreement.date.${part}`, normalizeAgreementDatePart(part, currentValue));
                      };

                      const renderPartyRow = (idx, enabled) => {
                        const caNamePath = `clientRegistration.clientAgreement.parties.${idx}.name`;
                        const caIdPath = `clientRegistration.clientAgreement.parties.${idx}.idNo`;
                        const caAddrPath = `clientRegistration.clientAgreement.parties.${idx}.address`;

                        return (
                          <div className={`rounded-2xl border border-zinc-200 bg-white/60 p-4 dark:border-zinc-800 dark:bg-zinc-950/25 ${!enabled ? "opacity-60" : ""}`}>
                            <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-3">({idx + 1})</div>

                            <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200">
                              <AgreementTextBox
                                disabled={!enabled}
                                w="w-56"
                                placeholder="Name"
                                value={getByPath(form, caNamePath) || ""}
                                onChange={(e) => update(caNamePath, e.target.value)}
                              />
                              <span className="text-zinc-600 dark:text-zinc-400">bearing National Identity Card No / Company registration No.</span>
                              <AgreementTextBox
                                disabled={!enabled}
                                w="w-44"
                                placeholder="NIC / Reg No"
                                value={getByPath(form, caIdPath) || ""}
                                onChange={(e) => update(caIdPath, e.target.value)}
                              />
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200">
                              <AgreementTextBox
                                disabled={!enabled}
                                w="w-[320px] sm:w-[520px]"
                                placeholder="Address"
                                value={getByPath(form, caAddrPath) || ""}
                                onChange={(e) => update(caAddrPath, e.target.value)}
                              />
                              <span className="text-zinc-600 dark:text-zinc-400">(Address)</span>
                            </div>
                          </div>
                        );
                      };

                      return (
                        <div className="mt-5 space-y-4">
                          {/* Agreement made on date */}
                          <div className="rounded-2xl border border-zinc-200 bg-white/60 p-4 dark:border-zinc-800 dark:bg-zinc-950/25">
                            <div className="text-sm text-zinc-800 dark:text-zinc-200">
                              This Agreement is made and entered into on this{" "}
                              <AgreementTextBox
                                w="w-16"
                                placeholder="DD"
                                value={date.day || ""}
                                inputMode="numeric"
                                maxLength={2}
                                onChange={(e) => setAgreementDate("day", e.target.value)}
                                onBlur={() => finalizeAgreementDate("day")}
                              />{" "}
                              date of{" "}
                              <AgreementTextBox
                                w="w-16"
                                placeholder="MM"
                                value={date.month || ""}
                                inputMode="numeric"
                                maxLength={2}
                                onChange={(e) => setAgreementDate("month", e.target.value)}
                                onBlur={() => finalizeAgreementDate("month")}
                              />{" "}
                              month{" "}
                              <AgreementTextBox
                                w="w-24"
                                placeholder="YYYY"
                                value={date.year || ""}
                                inputMode="numeric"
                                maxLength={4}
                                onChange={(e) => setAgreementDate("year", e.target.value)}
                                onBlur={() => finalizeAgreementDate("year")}
                              />{" "}
                              year
                            </div>
                          </div>

                          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">By and Between:</div>

                          <div className="grid grid-cols-1 gap-4">
                            {renderPartyRow(0, true)}
                            {renderPartyRow(1, jointEnabled)}
                            {renderPartyRow(2, secondJointEnabled)}
                          </div>

                          <div className="rounded-3xl border border-zinc-200 bg-gradient-to-br from-white via-white to-zinc-50/90 p-4 shadow-soft dark:border-zinc-800 dark:from-zinc-950/55 dark:via-zinc-950/35 dark:to-zinc-900/30">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div className="max-w-3xl">
                                {/* <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-emerald-300">
                                  Client Agreement
                                </div>
                                <div className="mt-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                  Agreement body is now shown in a cleaner preview.
                                </div> */}
                                <p className="mt-2 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                                  (hereinafter sometimes jointly and severally referred to as the &quot;Client/s&quot;) of the One Part ...
                                  This agreement includes the rights and responsibilities of the Client/s and the Stockbroker Firm,
                                  risk disclosures, indemnity, termination terms, and the final witness clause.
                                </p>
                                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                                  Click the button to read the full agreement.
                                </p>
                              </div>

                              <div className="sm:pl-4">
                                <button
                                  type="button"
                                  onClick={() => setShowClientAgreementModal(true)}
                                  className="inline-flex items-center justify-center rounded-2xl border border-emerald-600 bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                                >
                                  View Full Agreement
                                </button>
                              </div>
                            </div>
                          </div>

                          {showClientAgreementModal && (
                            <div className="fixed inset-0 z-[120] flex items-center justify-center bg-zinc-950/70 p-4 backdrop-blur-sm">
                              <div className="relative w-full max-w-5xl overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
                                <div className="flex items-center justify-between border-b border-zinc-200 bg-gradient-to-r from-zinc-50 to-white px-5 py-4 dark:border-zinc-800 dark:from-zinc-950 dark:to-zinc-900">
                                  <div>
                                    <div className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Client Agreement</div>
                                    {/* <div className="text-xs text-zinc-500 dark:text-zinc-400">Full agreement text from One Part to the witness clause.</div> */}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setShowClientAgreementModal(false)}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-lg font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
                                    aria-label="Close agreement popup"
                                  >
                                    ×
                                  </button>
                                </div>

                                <div className="max-h-[78vh] overflow-y-auto p-5">
                          <div className="rounded-2xl border border-zinc-200 bg-white/60 p-4 text-sm text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950/25 dark:text-zinc-200">
                            (hereinafter sometimes jointly and severally referred to as the &quot;Client/s&quot;) of the One Part
                            <div className="mt-3 font-medium">And</div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              Asha Securities Ltd a company duly incorporated under the laws of Sri Lanka bearing Company registration No. P B 405 and having its registered office at No 60 5th Lane Colombo 03(hereinafter referred to as "the Stockbroker Firm" which term or expression has herein used shall where the context requires or admits mean and include the said Stockbroker Firm, its successors and permitted assigns) of the Other Part
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              The Client/s and the Stockbroker Firm shall hereinafter be collectively referred to as "Parties" and each individually as "Party". 
                            </div>
                            <div className="mt-3 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              WHEREAS the Stockbroker Firm is a Member/Trading Member of the Colombo Stock Exchange (hereinafter referred to as the 'CSE') and is licensed by the Securities and Exchange Commission of Sri Lanka (hereinafter referred to as the 'SEC') to operate as a Stockbroker
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                               AND WHEREAS the Client/s is/are desirous of trading on the securities listed on the CSE through the said Stockbroker Firm and the Stockbroker Firm agrees to provide such services to the Client/s in accordance with the applicable Rules of the CSE, CDS, SEC and other applicable laws of Sri Lanka.
                            </div>
                            <div className="mt-3 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              NOW THEREFORE THIS AGREEMENT WITNESSETH and it is hereby agreed by and between the Parties hereto as follows: 
                            </div>
                            <div className="mt-3 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              <b>1.0 RIGHTS AND RESPONSIBILITIES OF THE CLIENT/S </b>
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              1.1 Subject to clause 1.5 below;
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              a) In the event of a Joint Account, the Client/s shall provide to the Stockbroker Firm, the name/s of the persons;- authorized to give trading orders and settlement instructions; and,- to whom payments by the Stockbroker Firm are to be made.
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              b) In the event of a Corporate Client Account, the Client shall provide to the Stockbroker Firm, the name/s of specific directors and officers authorized to;- trade in securities; and,- execute all documentation for trading and settlement in the account, together with a copy of the Board resolution certified by the Company Secretary evidencing same.
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              The aforesaid person/s shall hereinafter be referred to as 'authorized person/s'.
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              1.2 The Client/s shall notify the Stockbroker Firm in writing, if there is any change in the contact and/or other information provided by the Client/s to the Stockbroker Firm, within seven (7) calendar days of such change. 
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              1.3 Subject to clause 1.5 below, in the event the Client/authorized person(s) (as applicable) intends to purchase and/or sell securities, the Client/authorized person(s) (as applicable) shall give specific order instructions to the Investment Advisor (an employee of the Stockbroker Firm, who is certified by the CSE/SEC to deal with Clients) assigned to deal with the Client/s regarding same. 
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              1.4 The Client/authorized person(s) (as applicable) authorize/s the Stockbroker Firm to accept order instructions given by the Client/authorized person(s) (as applicable) to the Stockbroker Firm pertaining to the CDS Account of the Client/s through electronic means and other means including telephone, Short Message Service (SMS), E-mail and Fax. The order instructions provided by the Client/authorized person(s) (as applicable) through aforesaid means shall not be revoked or withdrawn by the Client/authorized person(s) (as applicable) after the execution of the order and shall therefore be confirmed. 
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              1.5 If the Client/s intends the Stockbroker Firm to use the Stockbroker Firm's own judgment, expertise and discretion to buy and/or sell securities on behalf of the Client/s, the Client/s shall provide the prior written authorization to the Stockbroker Firm for same. The said written authorization provided by the Client/s to the Stockbroker Firm shall clearly include the following; - Name of the Client/sand the CDS Account Number;- Effective Date of the authorization;-Applicable period of the authorization;- Investment objective (short term, long term, trading in any specific industry, any other specifications); and,- Purpose of giving discretion to the Registered Investment Advisor.
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              1.6 The Client/s shall ensure that cleared funds are made available to the Stockbroker Firm in respect of the securities purchased by the Stockbroker Firm on behalf of the Client/s, by 09.00 hours on the settlement date of such purchase transaction and if the Client/s fail/s to make payment as aforesaid, the Stockbroker Firm may, at its absolute discretion, charge an interest commencing from the day after the settlement date at a rate decided by the Stockbroker Firm, but not exceeding 0.1 % per day as specified in the Stockbroker/Stock Dealer Rules of the CSE. 
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              The Client/s shall accept the liabilities arising from all authorized transactions executed in the CDS Account of the Client/authorized person(s) (as applicable) by the Investment Advisor. 
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              1.7 7 If the Client/s has/have a complaint against the Stockbroker Firm relating to a particular transaction/s, the Client/s shall first refer such complaint to the Compliance Officer of the Stockbroker Firm, in writing, within a period of three (3) months from the date of the transaction/s. Where the Client/s is/are not satisfied with the decision given by the Stockbroker Firm or the manner in which the complaint was dealt with by the Stockbroker Firm, the Client/s may refer the complaint to the CSE, in writing, in accordance with the Procedure set out by the CSE (which is available on the CSE website, www.cse.lk). 
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              1.8 The Client/s agree/s that the Stockbroker Firm may, at its absolute discretion, sell not only the securities in respect of which payment has been defaulted by the Client/s, but also any other securities lying in the CDS Account of the Client/s in respect of which payment has been made by the Client/s, in full or part, in order to enable the Stockbroker Firm to recover the monies due to the Stockbroker Firm from the Client/s including interest and other applicable charges. 
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              1.9 9 The Client/s shall not; 
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              a. use any funds derived through illegal activity for the purpose of settling purchases of securities to the Client's CDS Account. 
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              b. enter into any verbal or written agreement/s with the employee/s of the Stockbroker Firm to share profits arising from the transactions carried out on behalf of the Client/s by the Stockbroker Firm.
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              <b>2.0 RIGHTS AND RESPONSIBILITIES OF THE STOCKBROKER FIRM</b>
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              2.1 Subject to clause 2.3 below; 
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              - authorized to give trading orders and settlement instructions; and,
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              - to whom payments by the Stockbroker Firm are to be made. 
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              b) In the event of a Corporate Client Account, the Stockbroker Firm shall obtain from the Client/s, the name/s of specific directors and officers authorized to;
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              - trade in securities; and,
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              -execute all documentation for trading and settlement in the account, 
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              together with a copy of the Board resolution certified by the Company Secretary evidencing same. 
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              c) the Stockbroker Firm shall carry out all transactions based on the specific order instructions provided by the Client/authorized person(s) (as applicable) through the communications channels specified in clause 1.4 of this Agreement. 
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              2.2 Prior to accepting any orders from a third party on behalf of the Client/s, the Stockbroker Firm shall first obtain the written authorization of the Client/s empowering the third party to trade on behalf of the Client/s through the Client's CDS Account. 
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              2.3 The Stockbroker Firm shall not exercise the discretion to buy or sell securities on behalf of the Client/s, unless the Client/s has/have given prior written authorization to the Stockbroker Firm to effect transactions for the Client/s without his/their specific order instructions as set out in clause 1.5 of this Agreement. 
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              2.4 The Stockbroker Firm shall send to the Client/s a note confirming the purchase and/or sale of securities (bought/sold note) by the end of the trade day (T). Upon obtaining the prior consent of the Client/s, the Stockbroker Firm may send the bought/sold notes to the Client/s in electronic form to the e-mail address provided by the Client/s for such purpose. 
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              2.5 The Stockbroker Firm shall send a Statement of Accounts to the Client/s who is/are debtor/s over Trade Day + 2 (T+2), on a monthly basis by the 7th day of the following month. This should apply when the client/s has/have had transactions during the month and the "interest charged on delayed payment" should also be considered as a transaction for this purpose. Such Statement of Accounts shall specify the transactions in the account including receipts and payments during the month under reference.
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              2.6 In the event the Statements of Accounts are issued electronically, the Stockbroker Firm shall obtain the consent of the Client/s and retain evidence of such consent. 
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              2.7 The Stockbroker Firm shall provide a copy of its latest Audited Financial Statements filed with the CSE to a Client/s, upon request by such Client/s. 
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              2.8 The Stockbroker Firm shall communicate in writing, directly with its Client/s in respect of statements, bought/sold notes or any other information unless the Client/s has/have authorized the Stockbroker Firm otherwise in writing. 
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              2.9 The Stockbroker Firm shall ensure that 'cleared funds' are made available to the Client(s) /authorized person(s) (as applicable) on the settlement date, unless the Client/s has/have expressly permitted the Stockbroker Firm, in writing, to hold the sales proceeds for future purchases. 
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              2.10 Upon the request of the Client/s, the Stockbroker Firm may: 
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              a) extend credit facilitates to the Client/s solely for the purpose of purchasing securities on the CSE and in accordance with the applicable Rules set out in the CSE Stockbroker Rules and terms and condition mutually agreed to between the Client/s and the Stockbroker Firm by way of a written agreement for extension of such facilities. 
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              b) provide internet trading facilities to such Client/s based on a written agreement mutually agreed between the Client/sand the Stockbroker Firm, in accordance with the requirements applicable to Internet Trading published by the CSE from time to time. 
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              2.11 The Stockbroker Firm shall assign a Registered Investment Advisor to deal with the Client/sand shall inform such Client/s regarding the name and contact details of the Registered investment Advisor assigned to such Client/s. Further, the Stockbroker Firm shall inform the Client in writing regarding any change to the Registered Investment Advisor within seven (7) Calendar Days of such change. 
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              2.12 The Stockbroker Firm shall forthwith notify the Client/s in writing, if there is any material change in contact or other information provided to the Client/s by the Stockbroker Firm.
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                               2.13 The Stockbroker Firm undertakes to maintain all information of the Client/sin complete confidence and the Stockbroker Firm shall not disclose such information to any person except in accordance with the Stockbroker Rules of the CSE. 
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              2.14 The Stockbroker Firm shall disclose to the Client/s, the existence of any incentive scheme applicable for employees of the Stockbroker Firm, which is based on turnover generated from the transactions carried out by the employees for the Client/ s.
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              2.15 The Stockbroker Firm may recover any outstanding balance arising from the purchase of securities of the Client/s from the sales proceeds due to the buyer only in the circumstances set out in the Stockbroker Rules of the CSE. 
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              2.16 The Stockbroker Firm shall provide services to the Client/sin compliance with the applicable Rules of the CSE, CDS, SEC and other applicable laws of Sri Lanka.
                            </div>
                            <div className="mt-3 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              <b>3.0 RISK DISCLOSURE STATEMENT </b>
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              3.1 The Stockbroker Firm agrees that a member of its staff who is authorized by the Board of Directors of the Stockbroker Firm to make declarations on behalf of the Stockbroker Firm has explained the applicable Risk Disclosures to the Client/sand has executed the declaration set out in Schedule 1 hereto in proof of same and such Schedule 1 shall form part and parcel of this Agreement 
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              3.2 The Client/s agree/sand acknowledge/s that he/she/it has understood the Risk Disclosures explained by the Stockbroker Firm and executed the Acknowledgement set out in Schedule 2 hereto and such Schedule 2 shall form part and parcel of this Agreement. 
                            </div>
                            <div className="mt-3 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              <b>4.0 INDEMNITY AND LIMITATION OF LIABILITY </b>
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              4.1 Each Party hereto, agrees to indemnify, defend and hold harmless the other Party against any loss, liability, damages, claims and costs, which each such Party may sustain by reason of negligence and/or breach of the terms and conditions hereof committed by the other Party hereto or its representatives. The aggrieved Party shall be entitled to enforce its/his/her indemnity rights by injunction or other equitable relief in any competent court of law in Sri Lanka. 
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              4.2 The Client/s agrees/s that the Stockbroker Firm will not be liable for any losses arising out of or relating to any cause which is beyond the control of the Stockbroker Firm.
                            </div>
                            <div className="mt-3 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              <b>5.0 TERMINATION </b>
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              5.1 This Agreement shall forthwith terminate, if the Stockbroker Firm for any reason ceases to be a Member/Trading Member of the CSE or if the license issued to the Stockbroker Firm by the SEC is cancelled. 
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              5.2 The Parties shall be entitled to terminate this Agreement upon giving notice in writing of not less than fourteen (14) calendar days to the other Party. 
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              5.3 Notwithstanding any such termination, all rights, liabilities and obligations of the Parties arising out of or in respect of the transactions entered into prior to the termination of this Agreement shall continue to be in force. 
                            </div>
                            <div className="mt-3 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              <b>6.0 GENERAL</b>
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              6.1 Words and expressions which are used in this Agreement, but which are not defined herein shall, unless the context otherwise requires, have the same meaning as assigned thereto in the Rules of the CSE, SEC and other applicable laws of Sri Lanka. 
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              6.2 The terms and conditions contained in this Agreement shall be subject to the applicable Rules, Regulations, Guidelines and Directions issued by SEC, Rules and Circulars of the CSE and other applicable laws of Sri Lanka. 
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              In the event of any contradiction between the terms and conditions hereof and the applicable Rules, Regulations, Guidelines and Directions issued by SEC, Rules and Circulars of the CSE or other applicable laws of Sri Lanka, the applicable Rules, Regulations, Guidelines and Directions issued by SEC, Rules and Circulars of the CSE or other applicable laws of Sri Lanka (as applicable) shall prevail. 
                            </div>
                            <div className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                              IN WITNESS WHEREOF the Parties to the Agreement have set their respective hands hereto and to one (01) other of the same tenor and date as herein above mentioned.
                            </div>

                          </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>

</div>

                  {/* ===================== PRIVACY NOTICE & DATA COLLECTION CONSENT CLAUSE ===================== */}
                  <div className="mt-6 rounded-3xl border border-zinc-200 bg-white/70 p-5 shadow-soft backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/35">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                          Privacy Notice &amp; Data Collection Consent Clause
                        </div>
                        {/* <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                          Please read carefully and confirm your consent before submitting.
                        </div> */}
                      </div>
                      {/* <div className="mt-2 sm:mt-0 inline-flex items-center rounded-full border border-zinc-300 bg-white/70 px-3 py-1 text-[11px] font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-300">
                        Required
                      </div> */}
                    </div>

                    <div className="mt-4 rounded-2xl border border-zinc-200 bg-gradient-to-br from-white/85 to-white/50 p-4 shadow-soft dark:border-zinc-800 dark:from-zinc-950/45 dark:to-zinc-950/20">
                      <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                        By submitting this form, you acknowledge and agree that Asha Securities Limited ("Company") may collect, process, and store your personal data in accordance with its Privacy Policy.
                      </div>

                      <ol className="mt-4 space-y-3 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                        <li>
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">1. Types of Data Collected:</span> The Company collects personal data, including but not limited to, your name, contact details, National Identity Card (NIC) number, financial information, and any other relevant details necessary for providing brokerage and related services.
                        </li>
                        <li>
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">2. Purpose of Data Collection:</span> Your personal data is collected for the purposes of account management, regulatory compliance, transaction processing, customer support, and improving our services.
                        </li>
                        <li>
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">3. Third-Party Sharing:</span> Your data may be shared with authorized third-party service providers or regulatory authorities where required by law, solely for operational and compliance purposes.
                        </li>
                        <li>
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">4. Data Retention:</span> Your personal data will be retained only for the period necessary to fulfil the purposes outlined in this notice or as required by applicable laws and regulations.
                        </li>
                        <li>
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">5. User Rights &amp; Consent:</span>
                          <ul className="mt-2 list-disc pl-5 space-y-1">
                            <li>You have the right to access, correct, or request the deletion of your personal data.</li>
                            <li>By checking the box below, you confirm that you have read and understood this notice and consent to the collection, processing, and storage of your personal data.</li>
                            <li>If applicable, you may provide additional consent for data sharing and marketing communications.</li>
                          </ul>
                        </li>
                        <div className="mt-4 space-y-3">
                      <label className="flex gap-3 rounded-2xl border border-zinc-200 bg-white/60 p-4 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/25">
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4"
                          checked={!!form.clientRegistration?.privacyConsent?.consentDataProcessing}
                          onChange={(e) => update("clientRegistration.privacyConsent.consentDataProcessing", e.target.checked)}
                        />
                        <div className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200">
                          I consent to the collection, processing, and storage of my personal data in accordance with the Company&apos;s Privacy Policy.
                        </div>
                      </label>

                      <label className="flex gap-3 rounded-2xl border border-zinc-200 bg-white/60 p-4 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/25">
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4"
                          checked={!!form.clientRegistration?.privacyConsent?.consentThirdPartySharing}
                          onChange={(e) => update("clientRegistration.privacyConsent.consentThirdPartySharing", e.target.checked)}
                        />
                        <div className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200">
                          I agree to share my data with third-party service providers for specified operational purposes.
                        </div>
                      </label>

                      <label className="flex gap-3 rounded-2xl border border-zinc-200 bg-white/60 p-4 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/25">
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4"
                          checked={!!form.clientRegistration?.privacyConsent?.consentMarketing}
                          onChange={(e) => update("clientRegistration.privacyConsent.consentMarketing", e.target.checked)}
                        />
                        <div className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200">
                          I would like to receive promotional updates via email/SMS.
                        </div>
                      </label>
                    </div>
                    <li>
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">6. Privacy Policy:</span> For more details on how your data is handled, please refer to our full Privacy Policy. 
                        </li>
                      </ol>

                      {/* <div className="mt-4 text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-400">
                        For more details on how your data is handled, please refer to our full Privacy Policy.
                      </div> */}
                    </div>

                    {/* <div className="mt-4 space-y-3">
                      <label className="flex gap-3 rounded-2xl border border-zinc-200 bg-white/60 p-4 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/25">
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4"
                          checked={!!form.clientRegistration?.privacyConsent?.consentDataProcessing}
                          onChange={(e) => update("clientRegistration.privacyConsent.consentDataProcessing", e.target.checked)}
                        />
                        <div className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200">
                          I consent to the collection, processing, and storage of my personal data in accordance with the Company&apos;s Privacy Policy.
                        </div>
                      </label>

                      <label className="flex gap-3 rounded-2xl border border-zinc-200 bg-white/60 p-4 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/25">
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4"
                          checked={!!form.clientRegistration?.privacyConsent?.consentThirdPartySharing}
                          onChange={(e) => update("clientRegistration.privacyConsent.consentThirdPartySharing", e.target.checked)}
                        />
                        <div className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200">
                          I agree to share my data with third-party service providers for specified operational purposes.
                        </div>
                      </label>

                      <label className="flex gap-3 rounded-2xl border border-zinc-200 bg-white/60 p-4 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/25">
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4"
                          checked={!!form.clientRegistration?.privacyConsent?.consentMarketing}
                          onChange={(e) => update("clientRegistration.privacyConsent.consentMarketing", e.target.checked)}
                        />
                        <div className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200">
                          I would like to receive promotional updates via email/SMS.
                        </div>
                      </label>
                    </div> */}
                  </div>


                  {/* ===================== AGREEMENT - CREDIT FACILITY (DOC STYLE) ===================== */}
                  <div className="mt-6">
                    <CreditFacilityAgreementLocalIndividual
                      form={form}
                      update={update}
                      busy={busy}
                      onPrev={() => {}}
                      onNext={() => {}}
                      cfPrincipalSig={cfPrincipalSig}
                      setCfPrincipalSig={setCfPrincipalSig}
                      cfFirmSig={cfFirmSig}
                      setCfFirmSig={setCfFirmSig}
                      cfWitness1Sig={cfWitness1Sig}
                      setCfWitness1Sig={setCfWitness1Sig}
                      cfWitness2Sig={cfWitness2Sig}
                      setCfWitness2Sig={setCfWitness2Sig}
                    />
                  </div>

                  {/* ===================== SCHEDULE 1 (DOC STYLE) ===================== */}
                  <div className="mt-6">
                    <Schedule1LocalIndividual
                      form={form}
                      update={update}
                      busy={busy}
                    />
                  </div>

                  {/* ===================== SCHEDULE 2 (DOC STYLE) ===================== */}
                  <div className="mt-6">
                    <Schedule2LocalIndividual
                      form={form}
                      update={update}
                      busy={busy}
                    />
                  </div>

                  {/* ===================== UPLOAD THE SIGNATURES (IMAGE STYLE) ===================== */}
                  <div className="mt-6">
                    <UploadSignaturesLocalIndividual
                      busy={busy}
                      jointEnabled={jointEnabled}
                      secondJointEnabled={secondJointEnabled}

                      principalSig={principalSig}
                      setPrincipalSig={setPrincipalSig}
                      jointSig={jointSig}
                      setJointSig={setJointSig}
                      secondJointSig={secondJointSig}
                      setSecondJointSig={setSecondJointSig}

                      clientSig={clientSig}
                      setClientSig={setClientSig}
                      advisorSig={advisorSig}
                      setAdvisorSig={setAdvisorSig}
                      liAgentSignature={liAgentSignature}
                      setLiAgentSignature={setLiAgentSignature}
                      agreementWitness1Sig={agreementWitness1Sig}
                      setAgreementWitness1Sig={setAgreementWitness1Sig}
                      agreementWitness2Sig={agreementWitness2Sig}
                      setAgreementWitness2Sig={setAgreementWitness2Sig}
                    />
                  </div>



                  
{/* <div className="mt-5 rounded-2xl border border-zinc-200 bg-white/50 px-4 py-3 text-xs sm:text-sm text-zinc-700 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-300">
                    Tip: You can leave Joint Applicant sections off if not applicable. Attach NIC/Passport images and the utility bill before submitting.
                  </div> */}
                </>
              )}

              {/* ⛔ Old Local → Individual form (kept in codebase, but disabled) */}
              {false && isLocalIndividual(region, type) && currentKey === "clientRegistration" && (
                <>
                  <h2 className="text-lg sm:text-xl font-semibold">Client Registration</h2>

                  <SectionTitle>Principal Applicant</SectionTitle>
                  <br></br>
<div className="grid grid-cols-1 gap-4">
                    <Field label="Title">
                      <Select
                        value={form.clientRegistration.principal.title} path="clientRegistration.principal.title"
                        onChange={(e) =>
                          update("clientRegistration.principal.title", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        <option value="Mr">Mr.</option>
                        <option value="Mrs">Mrs.</option>
                        <option value="Ms">Ms.</option>
                        <option value="Miss">Miss.</option>
                        <option value="Rev">Rev.</option>
                        <option value="Dr">Dr.</option>
                        <option value="Prof">Prof.</option>
                        <option value="Ven">Ven.</option>
                      </Select>
                    </Field>

                    <Field label="Initials">
                      <Input
                        value={form.clientRegistration.principal.initials} path="clientRegistration.principal.initials"
                        onChange={(e) =>
                          update("clientRegistration.principal.initials", e.target.value)
                        }
                      />
                    </Field>

                    <Field label="Names Denoted by Initials">
                      <Input
                        value={form.clientRegistration.principal.namesByInitials} path="clientRegistration.principal.namesByInitials"
                        onChange={(e) =>
                          update("clientRegistration.principal.namesByInitials", e.target.value)
                        }
                      />
                    </Field>

                    <Field label="Surname">
                      <Input
                        value={form.clientRegistration.principal.surname} path="clientRegistration.principal.surname"
                        onChange={(e) =>
                          update("clientRegistration.principal.surname", e.target.value)
                        }
                      />
                    </Field>
                  </div>


                  <Grid2>
                    {/*<Field label="Title">
                       <Select
                        value={form.clientRegistration.principal.title} path="clientRegistration.principal.title"
                        onChange={(e) =>
                          update("clientRegistration.principal.title", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        <option value="Mr">Mr.</option>
                        <option value="Mrs">Mrs.</option>
                        <option value="Ms">Ms.</option>
                        <option value="Miss">Miss.</option>
                        <option value="Rev">Rev.</option>
                        <option value="Dr">Dr.</option>
                        <option value="Prof">Prof.</option>
                        <option value="Ven">Ven.</option>
                      </Select>
                    </Field>

                    <Field label="Initials">
                      <Input
                        value={form.clientRegistration.principal.initials} path="clientRegistration.principal.initials"
                        onChange={(e) =>
                          update("clientRegistration.principal.initials", e.target.value)
                        }
                      />
                    </Field>

                    <Field label="Names Denoted by Initials">
                      <Input
                        value={form.clientRegistration.principal.namesByInitials} path="clientRegistration.principal.namesByInitials"
                        onChange={(e) =>
                          update("clientRegistration.principal.namesByInitials", e.target.value)
                        }
                      />
                    </Field>

                    <Field label="Surname">
                      <Input
                        value={form.clientRegistration.principal.surname} path="clientRegistration.principal.surname"
                        onChange={(e) =>
                          update("clientRegistration.principal.surname", e.target.value)
                        }
                      />
                    </Field> */}

                    <Field label="Telephone (Home)">
                      <PhoneInput placeholder="" value={form.clientRegistration.principal.telephoneHome} onChange={(v) => update("clientRegistration.principal.telephoneHome", v)} /></Field>

                    <Field label="Telephone (Office)">
                      <PhoneInput placeholder="" value={form.clientRegistration.principal.telephoneOffice} onChange={(v) => update("clientRegistration.principal.telephoneOffice", v)} /></Field>

                    <Field label="Mobile No.">
                      <PhoneInput placeholder="" value={form.clientRegistration.principal.mobile} onChange={(v) => update("clientRegistration.principal.mobile", v)} /></Field>

                    <Field label="Email">
                      <Input
                        path={"clientRegistration.principal.email"}
                        value={form.clientRegistration.principal.email}
                        onChange={(e) =>
                          update("clientRegistration.principal.email", e.target.value)
                        }
                      />
                    </Field>

                    <ColSpan2>
                      <Field label="Permanent Address">
                        <Input path="clientRegistration.principal.permanentAddress"
                          value={form.clientRegistration.principal.permanentAddress}
                          onChange={(e) =>
                            update(
                              "clientRegistration.principal.permanentAddress",
                              e.target.value
                            )
                          }
                        />
                      </Field>
                    </ColSpan2>

                    <ColSpan2>
                      <Field label="Correspondence Address">
                        <Input path="clientRegistration.principal.correspondenceAddress"
                          value={form.clientRegistration.principal.correspondenceAddress}
                          onChange={(e) =>
                            update(
                              "clientRegistration.principal.correspondenceAddress",
                              e.target.value
                            )
                          }
                        />
                      </Field>
                    </ColSpan2>

                    <Field label="NIC">
                      <Input
                        value={form.clientRegistration.principal.nic} path="clientRegistration.principal.nic"
                        onChange={(e) =>
                          update("clientRegistration.principal.nic", e.target.value)
                        }
                      />
                    </Field>

                    <Field label="Nationality">
                      <Input
                        value={form.clientRegistration.principal.nationality} path="clientRegistration.principal.nationality"
                        onChange={(e) =>
                          update("clientRegistration.principal.nationality", e.target.value)
                        }
                      />
                    </Field>

                    <Field label="NIC Date of Issue">
                      <Input
                        type="date"
                        value={form.clientRegistration.principal.nicDateOfIssue} path="clientRegistration.principal.nicDateOfIssue"
                        onChange={(e) =>
                          update("clientRegistration.principal.nicDateOfIssue", clampDateYear4(e.target.value))
                        }
                      />
                    </Field>

                    <Field label="CDS A/C Prefix">
                      <Select
                        value={form.clientRegistration.principal.cds.prefix} path="clientRegistration.principal.cds.prefix"
                        onChange={(e) =>
                          update("clientRegistration.principal.cds.prefix", e.target.value)
                        }
                      >
                        <option value="MSB">MSB</option>
                      </Select>
                    </Field>

                    <Field label="CDS A/C No">
                      <Input
                        value={form.clientRegistration.principal.cds.number} path="clientRegistration.principal.cds.number"
                        onChange={(e) =>
                          update("clientRegistration.principal.cds.number", e.target.value)
                        }
                      />
                    </Field>

                    <Field label="Occupation">
                      <Input
                        value={form.clientRegistration.principal.occupation} path="clientRegistration.principal.occupation"
                        onChange={(e) =>
                          update("clientRegistration.principal.occupation", e.target.value)
                        }
                      />
                    </Field>

                    <Field label="Employer Address">
                      <Input path="clientRegistration.principal.employerAddress"
                        value={form.clientRegistration.principal.employerAddress}
                        onChange={(e) =>
                          update(
                            "clientRegistration.principal.employerAddress",
                            e.target.value
                          )
                        }
                      />
                    </Field>

                    <Field label="Contact No">
                      <PhoneInput placeholder="" value={form.clientRegistration.principal.contactNo} onChange={(v) => update("clientRegistration.principal.contactNo", v)} /></Field>

                    <ColSpan2>
                      <Divider />
                    </ColSpan2>

                    <ColSpan2>
                      <div className="text-sm font-medium text-zinc-200">
                        Bank Account Details
                      </div>
                    </ColSpan2>

                    <Field label="Bank Name">
                      <Input path="clientRegistration.principal.bank.bankName"
                        value={form.clientRegistration.principal.bank.bankName}
                        onChange={(e) =>
                          update(
                            "clientRegistration.principal.bank.bankName",
                            e.target.value
                          )
                        }
                      />
                    </Field>

                    <Field label="Branch Name">
                      <Input path="clientRegistration.principal.bank.branchName"
                        value={form.clientRegistration.principal.bank.branchName}
                        onChange={(e) =>
                          update(
                            "clientRegistration.principal.bank.branchName",
                            e.target.value
                          )
                        }
                      />
                    </Field>

                    <Field label="Type of Account">
                      <Input path="clientRegistration.principal.bank.accountType"
                        value={form.clientRegistration.principal.bank.accountType}
                        onChange={(e) =>
                          update(
                            "clientRegistration.principal.bank.accountType",
                            e.target.value
                          )
                        }
                      />
                    </Field>

                    <Field label="A/C No">
                      <Input path="clientRegistration.principal.bank.accountNo"
                        value={form.clientRegistration.principal.bank.accountNo}
                        onChange={(e) =>
                          update(
                            "clientRegistration.principal.bank.accountNo",
                            e.target.value
                          )
                        }
                      />
                    </Field>

                    <Field label="Stock Market Experience">
                      <Input path="clientRegistration.principal.stockMarketExperience"
                        value={form.clientRegistration.principal.stockMarketExperience}
                        onChange={(e) =>
                          update(
                            "clientRegistration.principal.stockMarketExperience",
                            e.target.value
                          )
                        }
                      />
                    </Field>

                    <Field label="Present Brokers (if any)">
                      <Input path="clientRegistration.principal.presentBrokers"
                        value={form.clientRegistration.principal.presentBrokers}
                        onChange={(e) =>
                          update(
                            "clientRegistration.principal.presentBrokers",
                            e.target.value
                          )
                        }
                      />
                    </Field>
                  </Grid2>

                  <SectionTitle className="mt-8">Investment Decisions Are To Be :</SectionTitle>
                  <div className="mt-3 space-y-2 text-sm">
                    <CheckRow
                      checked={
                        form.clientRegistration.principal.investmentDecision.discretionary
                      }
                      onChange={(v) =>
                        update(
                          "clientRegistration.principal.investmentDecision.discretionary",
                          v
                        )
                      }
                      label="Discretionary"
                    />
                    <CheckRow
                      checked={
                        form.clientRegistration.principal.investmentDecision.nonDiscretionary
                      }
                      onChange={(v) =>
                        update(
                          "clientRegistration.principal.investmentDecision.nonDiscretionary",
                          v
                        )
                      }
                      label="Non Discretionary"
                    />
                    <CheckRow
                      checked={
                        form.clientRegistration.principal.investmentDecision
                          .fillDiscretionaryForm
                      }
                      onChange={(v) =>
                        update(
                          "clientRegistration.principal.investmentDecision.fillDiscretionaryForm",
                          v
                        )
                      }
                      label="If so please fill form of Discretionary"
                    />
                  </div>

                  <div className="mt-4 text-sm text-zinc-300">
                    ( A discretionary account is a CDS account that allows the investment advisor to
                    buy and sell securities without the client's consent for each trade. The client
                    must sign a discretionary disclosure with the broker clearly stating the investment
                    objectives of the Client as documentation of the client's consent. )
                  </div>

                  <SectionTitle className="mt-8">
                    Joint Applicants (Only applicable for joint applications.)
                  </SectionTitle>

                  <div className="mt-3 space-y-2">
                    <CheckRow
                      checked={jointEnabled}
                      onChange={(v) => update("clientRegistration.jointApplicant.enabled", v)}
                      label="Enable Joint Applicant"
                    />
                    <CheckRow
                      checked={secondJointEnabled}
                      onChange={(v) =>
                        update("clientRegistration.secondJointApplicant.enabled", v)
                      }
                      label="Enable 2nd Joint Applicant"
                    />
                  </div>

                  {jointEnabled && (
                    <>
                      <SectionTitle className="mt-6">Joint Applicant</SectionTitle>
                      <Grid2>
                        <Field label="Title">
                          <Select
                            value={form.clientRegistration.jointApplicant.title} path="clientRegistration.jointApplicant.title"
                        onChange={(e) =>
                          update("clientRegistration.jointApplicant.title", e.target.value)
                            }
                          >
                            <option value="">Select</option>
                            <option value="Mr">Mr.</option>
                            <option value="Mrs">Mrs.</option>
                            <option value="Ms">Ms.</option>
                            <option value="Miss">Miss.</option>
                            <option value="Rev">Rev.</option>
                            <option value="Dr">Dr.</option>
                            <option value="Prof">Prof.</option>
                            <option value="Ven">Ven.</option>
                          </Select>
                        </Field>

                        <Field label="Initials">
                          <Input path="clientRegistration.jointApplicant.initials"
                            value={form.clientRegistration.jointApplicant.initials}
                            onChange={(e) =>
                              update(
                                "clientRegistration.jointApplicant.initials",
                                e.target.value
                              )
                            }
                          />
                        </Field>

                        <Field label="Names Denoted by Initials">
                          <Input path="clientRegistration.jointApplicant.namesByInitials"
                            value={form.clientRegistration.jointApplicant.namesByInitials}
                            onChange={(e) =>
                              update(
                                "clientRegistration.jointApplicant.namesByInitials",
                                e.target.value
                              )
                            }
                          />
                        </Field>

                        <Field label="Surnames">
                          <Input path="clientRegistration.jointApplicant.surnames"
                            value={form.clientRegistration.jointApplicant.surnames}
                            onChange={(e) =>
                              update(
                                "clientRegistration.jointApplicant.surnames",
                                e.target.value
                              )
                            }
                          />
                        </Field>

                        {/* <Field label="Telephone (Home)">
                          <Input path="clientRegistration.jointApplicant.telephoneHome"
                            value={form.clientRegistration.jointApplicant.telephoneHome}
                            onChange={(e) =>
                              update(
                                "clientRegistration.jointApplicant.telephoneHome",
                                e.target.value
                              )
                            }
                          />
                        </Field>

                        <Field label="Telephone (Office)">
                          <Input path="clientRegistration.jointApplicant.telephoneOffice"
                            value={form.clientRegistration.jointApplicant.telephoneOffice}
                            onChange={(e) =>
                              update(
                                "clientRegistration.jointApplicant.telephoneOffice",
                                e.target.value
                              )
                            }
                          />
                        </Field>

                        <Field label="Mobile No.">
                          <Input
                            value={form.clientRegistration.jointApplicant.mobile} path="clientRegistration.jointApplicant.mobile"
                        onChange={(e) =>
                          update("clientRegistration.jointApplicant.mobile", e.target.value)
                            }
                          />
                        </Field>

                        <Field label="Email">
                          <Input
                            value={form.clientRegistration.jointApplicant.email} path="clientRegistration.jointApplicant.email"
                        onChange={(e) =>
                          update("clientRegistration.jointApplicant.email", e.target.value)
                            }
                          />
                        </Field> */}

                        <Field label="Telephone (Home)">
                          <PhoneInput placeholder="" value={form.clientRegistration.jointApplicant.telephoneHome} onChange={(v) => update("clientRegistration.jointApplicant.telephoneHome", v)} /></Field>

                        <Field label="Telephone (Office)">
                          <PhoneInput placeholder="" value={form.clientRegistration.jointApplicant.telephoneOffice} onChange={(v) => update("clientRegistration.jointApplicant.telephoneOffice", v)} /></Field>

                        <Field label="Mobile No.">
                          <PhoneInput placeholder="" value={form.clientRegistration.jointApplicant.mobile} onChange={(v) => update("clientRegistration.jointApplicant.mobile", v)} /></Field>

                        <Field label="Email">
                          <Input
                            path={"clientRegistration.jointApplicant.email"}
                            value={form.clientRegistration.jointApplicant.email}
                            onChange={(e) =>
                              update("clientRegistration.jointApplicant.email", e.target.value)
                            }
                          />
                        </Field>

                        <ColSpan2>
                          <Field label="Permanent Address">
                            <Input path="clientRegistration.jointApplicant.permanentAddress"
                              value={form.clientRegistration.jointApplicant.permanentAddress}
                              onChange={(e) =>
                                update(
                                  "clientRegistration.jointApplicant.permanentAddress",
                                  e.target.value
                                )
                              }
                            />
                          </Field>
                        </ColSpan2>

                        <ColSpan2>
                          <Field label="Correspondence Address">
                            <Input path="clientRegistration.jointApplicant.correspondenceAddress"
                              value={form.clientRegistration.jointApplicant.correspondenceAddress}
                              onChange={(e) =>
                                update(
                                  "clientRegistration.jointApplicant.correspondenceAddress",
                                  e.target.value
                                )
                              }
                            />
                          </Field>
                        </ColSpan2>

                        <Field label="NIC">
                          <Input
                            value={form.clientRegistration.jointApplicant.nic} path="clientRegistration.jointApplicant.nic"
                        onChange={(e) =>
                          update("clientRegistration.jointApplicant.nic", e.target.value)
                            }
                          />
                        </Field>

                        <Field label="NIC Date of Issue">
                          <Input path="clientRegistration.jointApplicant.nicDateOfIssue"
                            type="date"
                            value={form.clientRegistration.jointApplicant.nicDateOfIssue}
                            onChange={(e) =>
                              update(
                                "clientRegistration.jointApplicant.nicDateOfIssue",
                                e.target.value
                              )
                            }
                          />
                        </Field>

                        <Field label="Nationality">
                          <Input path="clientRegistration.jointApplicant.nationality"
                            value={form.clientRegistration.jointApplicant.nationality}
                            onChange={(e) =>
                              update(
                                "clientRegistration.jointApplicant.nationality",
                                e.target.value
                              )
                            }
                          />
                        </Field>

                        <Field label="Occupation">
                          <Input path="clientRegistration.jointApplicant.occupation"
                            value={form.clientRegistration.jointApplicant.occupation}
                            onChange={(e) =>
                              update(
                                "clientRegistration.jointApplicant.occupation",
                                e.target.value
                              )
                            }
                          />
                        </Field>
                      </Grid2>
                    </>
                  )}

                  {secondJointEnabled && (
                    <>
                      <SectionTitle className="mt-6">2nd Joint Applicant</SectionTitle>
                      <Grid2>
                        <Field label="Title">
                          <Select
                            value={form.clientRegistration.secondJointApplicant.title}
                            onChange={(e) =>
                              update(
                                "clientRegistration.secondJointApplicant.title",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select</option>
                            <option value="Mr">Mr.</option>
                            <option value="Mrs">Mrs.</option>
                            <option value="Ms">Ms.</option>
                            <option value="Miss">Miss.</option>
                            <option value="Rev">Rev.</option>
                            <option value="Dr">Dr.</option>
                            <option value="Prof">Prof.</option>
                            <option value="Ven">Ven.</option>
                          </Select>
                        </Field>

                        <Field label="Initials">
                          <Input path="clientRegistration.secondJointApplicant.initials"
                            value={form.clientRegistration.secondJointApplicant.initials}
                            onChange={(e) =>
                              update(
                                "clientRegistration.secondJointApplicant.initials",
                                e.target.value
                              )
                            }
                          />
                        </Field>

                        <Field label="Names Denoted by Initials">
                          <Input path="clientRegistration.secondJointApplicant.namesByInitials"
                            value={form.clientRegistration.secondJointApplicant.namesByInitials}
                            onChange={(e) =>
                              update(
                                "clientRegistration.secondJointApplicant.namesByInitials",
                                e.target.value
                              )
                            }
                          />
                        </Field>

                        <Field label="Surnames">
                          <Input path="clientRegistration.secondJointApplicant.surnames"
                            value={form.clientRegistration.secondJointApplicant.surnames}
                            onChange={(e) =>
                              update(
                                "clientRegistration.secondJointApplicant.surnames",
                                e.target.value
                              )
                            }
                          />
                        </Field>

                        <Field label="Residential Address">
                          <Input path="clientRegistration.secondJointApplicant.residentialAddress"
                            value={
                              form.clientRegistration.secondJointApplicant.residentialAddress
                            }
                            onChange={(e) =>
                              update(
                                "clientRegistration.secondJointApplicant.residentialAddress",
                                e.target.value
                              )
                            }
                          />
                        </Field>

                        <Field label="Office Address">
                          <Input path="clientRegistration.secondJointApplicant.officeAddress"
                            value={form.clientRegistration.secondJointApplicant.officeAddress}
                            onChange={(e) =>
                              update(
                                "clientRegistration.secondJointApplicant.officeAddress",
                                e.target.value
                              )
                            }
                          />
                        </Field>

                        <Field label="NIC">
                          <Input path="clientRegistration.secondJointApplicant.nic"
                            value={form.clientRegistration.secondJointApplicant.nic}
                            onChange={(e) =>
                              update(
                                "clientRegistration.secondJointApplicant.nic",
                                e.target.value
                              )
                            }
                          />
                        </Field>

                        <Field label="NIC Date of Issue">
                          <Input path="clientRegistration.secondJointApplicant.nicDateOfIssue"
                            type="date"
                            value={form.clientRegistration.secondJointApplicant.nicDateOfIssue}
                            onChange={(e) =>
                              update(
                                "clientRegistration.secondJointApplicant.nicDateOfIssue",
                                e.target.value
                              )
                            }
                          />
                        </Field>

                        <Field label="Nationality">
                          <Input path="clientRegistration.secondJointApplicant.nationality"
                            value={form.clientRegistration.secondJointApplicant.nationality}
                            onChange={(e) =>
                              update(
                                "clientRegistration.secondJointApplicant.nationality",
                                e.target.value
                              )
                            }
                          />
                        </Field>

                        <Field label="Occupation">
                          <Input path="clientRegistration.secondJointApplicant.occupation"
                            value={form.clientRegistration.secondJointApplicant.occupation}
                            onChange={(e) =>
                              update(
                                "clientRegistration.secondJointApplicant.occupation",
                                e.target.value
                              )
                            }
                          />
                        </Field>

                        <Field label="Telephone (Home)">
                          <PhoneInput placeholder="" value={form.clientRegistration.secondJointApplicant.telephoneHome} onChange={(v) => update("clientRegistration.secondJointApplicant.telephoneHome", v)} /></Field>

                        <Field label="Telephone (Office)">
                          <PhoneInput placeholder="" value={form.clientRegistration.secondJointApplicant.telephoneOffice} onChange={(v) => update("clientRegistration.secondJointApplicant.telephoneOffice", v)} /></Field>

                    

                        {/* <Field label="Telephone (Home)">
                          <Input path="clientRegistration.secondJointApplicant.telephoneHome"
                            value={form.clientRegistration.secondJointApplicant.telephoneHome}
                            onChange={(e) =>
                              update(
                                "clientRegistration.secondJointApplicant.telephoneHome",
                                e.target.value
                              )
                            }
                          />
                        </Field>

                        <Field label="Telephone (Office)">
                          <Input path="clientRegistration.secondJointApplicant.telephoneOffice"
                            value={form.clientRegistration.secondJointApplicant.telephoneOffice}
                            onChange={(e) =>
                              update(
                                "clientRegistration.secondJointApplicant.telephoneOffice",
                                e.target.value
                              )
                            }
                          />
                        </Field> */}
                      </Grid2>
                    </>
                  )}

                  <SectionTitle className="mt-8">
                    Reference to Section 1.1 (a) of the Client Agreement of Asha Securities Limited.
                    <br />
                    Joint CDS Account Instructions.
                  </SectionTitle>

                  <Grid2>
                    <Field label="CDS A/C No">
                      <div className="flex gap-2">
                        <Select
                          value={form.clientRegistration.jointCdsInstructions.cdsPrefix} path="clientRegistration.jointCdsInstructions.cdsPrefix"
                        onChange={(e) =>
                          update("clientRegistration.jointCdsInstructions.cdsPrefix", e.target.value)}
                          className="w-28"
                        >
                          <option value="MSB">MSB</option>
                        </Select>

                        <Input
                          placeholder="Enter CDS A/C No"
                          value={form.clientRegistration.principal.cds.number} path="clientRegistration.principal.cds.number"
                        onChange={(e) =>
                          update("clientRegistration.principal.cds.number", e.target.value)}
                        />
                      </div>
                    </Field>

                    <Field label="Principal Holder">
                      <Input
                        placeholder="Enter Principal Holder"
                        value={form.clientRegistration.principal.initials} path="clientRegistration.principal.initials"
                        onChange={(e) =>
                          update("clientRegistration.principal.initials", e.target.value)}
                      />
                    </Field>

                    <Field label="First Joint Holder (Only applicable for joint applications)">
                      <Input
                        placeholder="Enter First Joint Holder"
                        value={form.clientRegistration.jointApplicant.initials} path="clientRegistration.jointApplicant.initials"
                        onChange={(e) =>
                          update("clientRegistration.jointApplicant.initials", e.target.value)}
                      />
                    </Field>

                    <Field label="Second Joint Holder (Only applicable for joint applications)">
                      <Input
                        placeholder="Enter Second Joint Holder"
                        value={form.clientRegistration.secondJointApplicant.initials} path="clientRegistration.secondJointApplicant.initials"
                        onChange={(e) =>
                          update("clientRegistration.secondJointApplicant.initials", e.target.value)}
                      />
                    </Field>

                    <Field label="Date">
                      <Input
                        type="date"
                        value={form.clientRegistration.jointCdsInstructions.date} path="clientRegistration.jointCdsInstructions.date"
                        onChange={(e) =>
                          update("clientRegistration.jointCdsInstructions.date", clampDateYear4(e.target.value))}
                      />
                    </Field>
                  </Grid2>

                  <Divider />

                  <p className="mt-4 text-sm text-zinc-300">
                    Reference to Section 1.1(a) of the Client Agreement of Asha Securities Limited. I authorize to give trading orders and settlement orders to Asha Securities Limited. I have no objection in Asha Securities Limited making payments to
                  </p>

                  <Grid2>
                    <Field label="Enter Name of Principal Holder">
                      <Input
                        placeholder="Enter Name of Principal Holder"
                        // value={form.clientRegistration.jointCdsInstructions.iName}
                        value={form.clientRegistration.principal.namesByInitials} path="clientRegistration.principal.namesByInitials"
                        onChange={(e) =>
                          update("clientRegistration.principal.namesByInitials", e.target.value)}
                      />
                    </Field>

                    <Field label="Enter Name of Joint Holder/s">
                      <Input
                        placeholder="Enter Name of Joint Holder/s"
                        value={form.clientRegistration.jointCdsInstructions.authorizeJointName} path="clientRegistration.jointCdsInstructions.authorizeJointName"
                        onChange={(e) =>
                          update("clientRegistration.jointCdsInstructions.authorizeJointName", e.target.value)}
                      />
                    </Field>
                  </Grid2>

                  <Grid2>
                    <Field label="Enter Name of Principal Holder">
                      <Input
                        placeholder="Enter Name of Principal Holder"
                        // value={form.clientRegistration.jointCdsInstructions.iName}
                        value={form.clientRegistration.principal.namesByInitials} path="clientRegistration.principal.namesByInitials"
                        onChange={(e) =>
                          update("clientRegistration.principal.namesByInitials", e.target.value)}
                      />
                    </Field>

                    <Field label="Enter Name of Joint Holder/s">
                      <Input
                        placeholder="Enter Name of Joint Holder/s"
                        value={form.clientRegistration.jointCdsInstructions.authorizeJointName} path="clientRegistration.jointCdsInstructions.authorizeJointName"
                        onChange={(e) =>
                          update("clientRegistration.jointCdsInstructions.authorizeJointName", e.target.value)}
                      />
                    </Field>
                  </Grid2>

                  <SectionTitle className="mt-8">
                    Herewith attached the photocopy of bank proof for your reference.
                  </SectionTitle>

                  <div className="mt-4 grid grid-cols-1 gap-4">
                    <FileUpload
                      label="Bank proof (photo-copy) (required)"
                      accept=".pdf,image/*"
                      file={bankProof}
                      setFile={setBankProof}
                      path="bankProof"
                    />
                    <FileUpload
                      label="Signature of Principal Applicant (required)"
                      accept="image/*"
                      file={principalSig}
                      setFile={setPrincipalSig}
                      path="principalSig"
                    />

                    {/* ✅ OPTIONAL */}
                    {jointEnabled && (
                      <FileUpload
                        label="Signature of Joint Applicant (optional)"
                        accept="image/*"
                        file={jointSig}
                        setFile={setJointSig}
                        path="jointSig"
                      />
                    )}

                    {secondJointEnabled && (
                      <FileUpload
                        label="Signature of 2nd Joint Applicant (optional)"
                        accept="image/*"
                        file={secondJointSig}
                        setFile={setSecondJointSig}
                        path="secondJointSig"
                      />
                    )}
                  </div>

                  {/* ✅ ADD THE REMAINING UI (YOUR SCREENSHOT) AFTER 2ND JOINT SIGNATURE */}
                  <Divider />

                  <SectionTitle className="mt-2">Declaration by the staff.</SectionTitle>

                  {/* Row 1 */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    <div className="md:col-span-5">
                      <Field label="">
                        <Input
                          placeholder="Enter Staff Name"
                          value={form.declaration.staffName} path="declaration.staffName"
                        onChange={(e) =>
                          update("declaration.staffName", e.target.value)}
                        />
                      </Field>
                    </div>

                    <div className="md:col-span-7 text-xs md:text-sm text-zinc-300 leading-relaxed pt-2">
                      (Investment Advisor) on behalf of the Asha Securities Ltd has clearly explained the Risk disclosure statement to
                      the client while inviting the client to read and ask questions and take independent advice if the client wishes.
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="mt-6 grid grid-cols-1 gap-4">
                    <div className="md:col-span-5">
                      <FileUpload
                        label="Clients Signature (required)"
                        accept="image/*"
                        file={clientSig}
                        setFile={setClientSig}
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-5">
                      <Field label="Name of Person/s Authorises to Give Instructions">
                        <Input
                          placeholder="Enter Name of Person/s"
                          value={form.declaration.authorizedPersonsName} path="declaration.authorizedPersonsName"
                        onChange={(e) =>
                          update("declaration.authorizedPersonsName", e.target.value)
                          }
                        />
                      </Field>
                    </div>

                    <div className="md:col-span-4">
                      <Field label="NIC of Person/s Authorises to Give Instructions">
                        <Input
                          placeholder="Enter NIC No"
                          value={form.declaration.authorizedPersonsNic} path="declaration.authorizedPersonsNic"
                        onChange={(e) =>
                          update("declaration.authorizedPersonsNic", e.target.value)
                          }
                        />
                      </Field>
                    </div>
                  </div>

                  <div className="mt-8 text-center text-sm font-semibold text-zinc-200">
                    Office Use Only
                  </div>

                  {/* Row 3 */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-4">
                      <Field label="Application received on">
                        <Input
                          type="date"
                          value={form.declaration?.officeUseOnly?.applicationReceivedOn ?? ""} path="declaration.officeUseOnly.applicationReceivedOn"
                        onChange={(e) =>
                          update("declaration.officeUseOnly.applicationReceivedOn", clampDateYear4(e.target.value))
                          }
                        />
                      </Field>
                    </div>

                    <div className="md:col-span-4">
                      <Field label="Advisor's Name">
                        <Input
                          placeholder="Enter Name"
                          value={form.declaration?.officeUseOnly?.advisorsName ?? ""} path="declaration.officeUseOnly.advisorsName"
                        onChange={(e) =>
                          update("declaration.officeUseOnly.advisorsName", e.target.value)
                          }
                        />
                      </Field>
                    </div>

                    <div className="md:col-span-4">
                      <FileUpload
                        label="Advisor's Signature (optional)"
                        accept="image/*"
                        file={advisorSig}
                        setFile={setAdvisorSig}
                      path="advisorSig"
                      // path="advisorSig"
                      />
                    </div>
                  </div>

                  <Divider />

                  <div className="text-sm text-zinc-300">I/We,</div>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-6">
                      <Field label="Name">
                        <Input
                          placeholder="Enter Name"
                          // value={form.declaration?.iWe?.name ?? ""}
                          value={form.clientRegistration.principal.namesByInitials} path="clientRegistration.principal.namesByInitials"
                        onChange={(e) =>
                          update("clientRegistration.principal.namesByInitials", e.target.value)}
                        />
                      </Field>
                    </div>

                    <div className="md:col-span-6">
                      <Field label="NIC No">
                        <Input
                          placeholder="Enter NIC No"
                          // value={form.declaration?.iWe?.nicNo ?? ""}
                          value={form.clientRegistration.principal.nic} path="clientRegistration.principal.nic"
                        onChange={(e) =>
                          update("clientRegistration.principal.nic", e.target.value)}
                        />
                      </Field>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-6">
                      <Field label="CDS A/C No">
                        <div className="flex gap-2">
                          <Select
                            value={form.declaration?.iWe?.cds?.prefix ?? ""} path="declaration.iWe.cds.prefix"
                        onChange={(e) =>
                          update("declaration.iWe.cds.prefix", e.target.value)
                            }
                            className="w-28"
                          >
                            <option value="MSB">MSB</option>
                          </Select>

                          <Input
                            placeholder="Enter CDS A/C No"
                            // value={form.declaration?.iWe?.cds?.number ?? ""}
                            value={form.clientRegistration.principal.cds.number} path="clientRegistration.principal.cds.number"
                        onChange={(e) =>
                          update("clientRegistration.principal.cds.number", e.target.value)
                            }
                          />
                        </div>
                      </Field>
                    </div>

                    <div className="md:col-span-6">
                      <Field label="Permanent Address">
                        <Input
                          placeholder="Enter Address"
                          // value={form.declaration?.iWe?.address ?? ""}
                          value={form.clientRegistration.principal.permanentAddress} path="clientRegistration.principal.permanentAddress"
                        onChange={(e) =>
                          update("clientRegistration.principal.permanentAddress", e.target.value)}
                        />
                      </Field>
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-zinc-400">
                    here by declare that I / we aware of particulars given below.
                  </div>

                  <div className="mt-2 text-xs text-zinc-400 leading-relaxed">
                    I / We undertake to operate my / our share trading account with ASHA SECURITIES
                    LTD. (Hereinafter referred to as BROKER) in accordance with CSE Stock Broker Rule
                    and other prevailing laws and regulations of Sri Lanka and in particular to the
                    authority hereinafter granted by me / us to the Broker.
                  </div>

                  <div className="mt-2 text-xs text-zinc-400 leading-relaxed">
                    In the event of my / our failure to settle the amounts due in respect of a share purchase, I / we do hereby irrevocably authorize the Broker to sell such securities involved in the default and if such proceeds are inadequate to cover the shortfall and any loss incurred by the Broker, to sell any other security in my I our portfolio held by the Broker in the Central Depository Systems (Pvt) Ltd., so that the full amount due to the Broker may be settled and any surplus arising on the sale of shares shall accrue to the Broker unless such surplus arise from the sale of other quoted shares deposited by the buyer as collateral with broker in which event the surplus shall be remitted to alter settlement day of the relevant sale (s).
                  </div>

                  <div className="mt-2 text-xs text-zinc-400 leading-relaxed">
                    The funds to be invested for the purchase of Securities through the Securities Account to be opened with the CDS will not be funds derived from any money laundering activity or funds generated through financing of terrorist or any other illegal activity.
                  </div>

                  <div className="mt-2 text-xs text-zinc-400 leading-relaxed">
                    In the event of a variation of any information given in the CDS Form 1, Addendum to CDS Form 1(A) this declaration and other information submitted by me / us along with the application to open a CDS Account, I/ we undertake to inform the CDS in writing within fourteen (14) days of such variation.
                  </div>

                  <div className="mt-2 text-xs text-zinc-400 leading-relaxed">
                    Change of Broker Material Information (Ownership / Address) will be notified over public notice in printed Media.
                  </div>

                  <div className="mt-2 text-xs text-zinc-400 leading-relaxed">
                    The irrevocable authority granted hereby shall in no way effect or exempt me / us from any liability as stated herein towards the BROKER arising from or consequent upon any such default.
                  </div>

                  <div className="mt-2 text-xs text-zinc-400 leading-relaxed">
                    Also I / we do hereby irrevocably agree that in the event of any purchase orders placed with you for the purchase of shares, I / we shall pay approximately 50% of the value of such purchase by a legal tender which amount shall be set off against the total amount due from me I us to you on the due date of settlement in respect of such purchases, and the relevant investment advisors may be incentivized by the company on such purchase and sales turnovers.
                  </div>

                  <div className="mt-2 text-xs text-zinc-400 leading-relaxed">
                    Any delayed payments will be subject to additional interest cost on the consideration and will be debited to my / our account. Interest percentage will be decided by the Broker considering the prevailing interest rates. (not exceeding a maximum interest rate of 0.1% per day)
                  </div>

                  <div className="mt-2 text-xs text-zinc-400 leading-relaxed">
                    The risk disclosure statement was explained while advising independently and was invited to read and ask questions.
                  </div>

                  <div className="mt-2 text-xs text-zinc-400 leading-relaxed">
                    Services provided: - Online Facility, Research Reports.
                  </div>

                  {/* ✅ NEW UI FROM IMAGE (DO NOT REMOVE EXISTING CODE ABOVE) */}
                  <div className="mt-6 grid grid-cols-1 gap-4">
                    <FileUpload
                      label="Signature of Principal Applicant"
                      accept="image/*"
                      file={principalSig}
                      setFile={setPrincipalSig}
                      path="principalSig"
                    />

                    <FileUpload
                      label="Signature of Joint Applicant"
                      accept="image/*"
                      file={jointSig}
                      setFile={setJointSig}
                        path="jointSig"
                    />

                    <FileUpload
                      label="Signature of 2nd Joint Applicant"
                      accept="image/*"
                      file={secondJointSig}
                      setFile={setSecondJointSig}
                        path="secondJointSig"
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4">
                    <Field label="Name of the Certifying Officer">
                      <Input
                        value={form.clientRegistration?.certifyingOfficer?.name || ""} path="clientRegistration.certifyingOfficer.name"
                        onChange={(e) =>
                          update("clientRegistration.certifyingOfficer.name", e.target.value)
                        }
                      />
                    </Field>

                    <Field label="Signature of the Certifying Officer">
                      <Input path="clientRegistration.certifyingOfficer.signature"
                        value={form.clientRegistration?.certifyingOfficer?.signature || ""}
                        onChange={(e) =>
                          update(
                            "clientRegistration.certifyingOfficer.signature",
                            e.target.value
                          )
                        }
                      />
                    </Field>

                    <Field label="Date">
                      <Input
                        type="date"
                        value={form.clientRegistration?.certifyingOfficer?.date || ""} path="clientRegistration.certifyingOfficer.date"
                        onChange={(e) =>
                          update("clientRegistration.certifyingOfficer.date", e.target.value)
                        }
                      />
                    </Field>
                  </div>

                </>
              )}

              {/* ===================== DECLARATION STEP (keep your original step too) ===================== */}
              {currentKey === "declaration" && (
                <>
                  <h2 className="text-xl font-semibold">Declaration</h2>

                  {/* ---------------- SCHEDULE 1 - DECLARATION ---------------- */}
                  <div className="mt-6 text-center text-sm font-semibold text-zinc-200">
                    SCHEDULE 1 - DECLARATION
                  </div>

                  <div className="mt-4">
                    <Field label="Enter full name of the authorised person in block letters">
                      <Input
                        value={form?.declaration?.schedule1?.authorisedPersonFullName || ""} path="declaration.schedule1.authorisedPersonFullName"
                        onChange={(e) =>
                          update("declaration.schedule1.authorisedPersonFullName", (e.target.value || "").toUpperCase())
                        }
                      />
                    </Field>
                  </div>

                  <div className="mt-4 text-xs text-zinc-400 leading-relaxed">
                    an employee of Asha Securities Ltd (Stockbroker Firm), who is duly authorized by the
                    Board of Directors of the Stockbroker Firm to make declarations on its behalf hereby
                    confirm that the following risks involved in investing/trading in securities listed on
                    the Colombo Stock Exchange (“Risk Disclosure Statements”) were clearly explained by me to
                  </div>

                  <div className="mt-3">
                    <Field label="Enter name/s of the client/s">
                      <Input
                        value={form?.declaration?.schedule1?.clientNames || ""} path="declaration.schedule1.clientNames"
                        onChange={(e) =>
                          update("declaration.schedule1.clientNames", e.target.value)
                        }
                      />
                    </Field>
                  </div>

                  <div className="mt-3 text-xs text-zinc-400 leading-relaxed">
                    (the Client/s) and invited the Client/s to read the below mentioned Risk Disclosure Statements,
                    ask questions and take independent advice if the Client/s wish/es to:
                  </div>

                  <ol className="mt-3 list-decimal pl-6 text-xs text-zinc-400 space-y-1">
                    <li>
                      The prices of securities fluctuate, sometimes drastically and the price of a security may
                      depreciate in value and may even become valueless.
                    </li>
                    <li>
                      It is possible that losses may be incurred rather than profits made as a result of transacting in
                      securities.
                    </li>
                    <li>
                      It is advisable to invest funds that are not required in the short term to reduce the risk of investing.
                    </li>
                  </ol>

                  <div className="mt-6 text-xs text-zinc-400">Signed on behalf of the Stockbroker Firm by :</div>

                  <div className="mt-3">
                    <Field label="Enter name of the authorized person">
                      <Input
                        value={form?.declaration?.schedule1?.signedOnBehalfBy || ""} path="declaration.schedule1.signedOnBehalfBy"
                        onChange={(e) =>
                          update("declaration.schedule1.signedOnBehalfBy", e.target.value)
                        }
                      />
                    </Field>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4">
                    <FileUpload
                      label="Signature"
                      accept="image/*,.pdf"
                      file={advisorSig}
                      setFile={setAdvisorSig}
                      path="advisorSig"
                      // path="advisorSig"
                    />

                    <Field label="Name">
                      <Input
                        value={form?.declaration?.schedule1?.name || ""} path="declaration.schedule1.name"
                        onChange={(e) =>
                          update("declaration.schedule1.name", e.target.value)
                        }
                      />
                    </Field>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4">
                    <Field label="Designation">
                      <Input
                        value={form?.declaration?.schedule1?.designation || ""} path="declaration.schedule1.designation"
                        onChange={(e) =>
                          update("declaration.schedule1.designation", e.target.value)
                        }
                      />
                    </Field>

                    <Field label="NIC No">
                      <Input
                        value={form?.declaration?.schedule1?.nicNo || ""} path="declaration.schedule1.nicNo"
                        onChange={(e) =>
                          update("declaration.schedule1.nicNo", e.target.value)
                        }
                      />
                    </Field>

                    <Field label="Date">
                      <Input
                        type="date"
                        value={form?.declaration?.schedule1?.date || ""} path="declaration.schedule1.date"
                        onChange={(e) =>
                          update("declaration.schedule1.date", clampDateYear4(e.target.value))
                        }
                      />
                    </Field>
                  </div>

                  <Divider />

                  {/* ---------------- SCHEDULE 2 - ACKNOWLEDGEMENT ---------------- */}
                  <div className="mt-2 text-center text-sm font-semibold text-zinc-200">
                    SCHEDULE 2 - ACKNOWLEDGEMENT
                  </div>

                  <div className="mt-4 text-xs text-zinc-400">I/We,</div>

                  {/* Person (1) */}
                  <div className="mt-3 rounded-2xl border border-zinc-800 bg-zinc-950/30 p-4">
                    <div className="text-xs text-zinc-300 mb-3">(1)</div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                      <div className="md:col-span-5">
                        <Field label="Name">
                          <Input
                            value={form?.declaration?.schedule2?.person1?.name || ""} path="declaration.schedule2.person1.name"
                        onChange={(e) =>
                          update("declaration.schedule2.person1.name", e.target.value)
                            }
                          />
                        </Field>
                      </div>

                      <div className="md:col-span-3">
                        <Field label="Bearing National Identity Card No">
                          <Input
                            value={form?.declaration?.schedule2?.person1?.nicNo || ""} path="declaration.schedule2.person1.nicNo"
                        onChange={(e) =>
                          update("declaration.schedule2.person1.nicNo", e.target.value)
                            }
                          />
                        </Field>
                      </div>

                      <div className="md:col-span-4">
                        <Field label="Address">
                          <Input
                            value={form?.declaration?.schedule2?.person1?.address || ""} path="declaration.schedule2.person1.address"
                        onChange={(e) =>
                          update("declaration.schedule2.person1.address", e.target.value)
                            }
                          />
                        </Field>
                      </div>
                    </div>
                  </div>

                  {/* Person (2) */}
                  <div className="mt-3 rounded-2xl border border-zinc-800 bg-zinc-950/30 p-4">
                    <div className="text-xs text-zinc-300 mb-3">(2) </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                      <div className="md:col-span-5">
                        <Field label="Name">
                          <Input
                            value={form?.declaration?.schedule2?.person2?.name || ""} path="declaration.schedule2.person2.name"
                        onChange={(e) =>
                          update("declaration.schedule2.person2.name", e.target.value)
                            }
                          />
                        </Field>
                      </div>

                      <div className="md:col-span-3">
                        <Field label="Bearing National Identity Card No">
                          <Input
                            value={form?.declaration?.schedule2?.person2?.nicNo || ""} path="declaration.schedule2.person2.nicNo"
                        onChange={(e) =>
                          update("declaration.schedule2.person2.nicNo", e.target.value)
                            }
                          />
                        </Field>
                      </div>

                      <div className="md:col-span-4">
                        <Field label="Address">
                          <Input
                            value={form?.declaration?.schedule2?.person2?.address || ""} path="declaration.schedule2.person2.address"
                        onChange={(e) =>
                          update("declaration.schedule2.person2.address", e.target.value)
                            }
                          />
                        </Field>
                      </div>
                    </div>
                  </div>

                  {/* Person (3) */}
                  <div className="mt-3 rounded-2xl border border-zinc-800 bg-zinc-950/30 p-4">
                    <div className="text-xs text-zinc-300 mb-3">(3)</div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                      <div className="md:col-span-5">
                        <Field label="Name">
                          <Input
                            value={form?.declaration?.schedule2?.person3?.name || ""} path="declaration.schedule2.person3.name"
                        onChange={(e) =>
                          update("declaration.schedule2.person3.name", e.target.value)
                            }
                          />
                        </Field>
                      </div>

                      <div className="md:col-span-3">
                        <Field label="Bearing National Identity Card No">
                          <Input
                            value={form?.declaration?.schedule2?.person3?.nicNo || ""} path="declaration.schedule2.person3.nicNo"
                        onChange={(e) =>
                          update("declaration.schedule2.person3.nicNo", e.target.value)
                            }
                          />
                        </Field>
                      </div>

                      <div className="md:col-span-4">
                        <Field label="Address">
                          <Input
                            value={form?.declaration?.schedule2?.person3?.address || ""} path="declaration.schedule2.person3.address"
                        onChange={(e) =>
                          update("declaration.schedule2.person3.address", e.target.value)
                            }
                          />
                        </Field>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-3xl border border-zinc-800/70 bg-zinc-950/25 px-4 py-4 text-xs text-zinc-300 leading-[1.9] shadow-[0_14px_30px_rgba(0,0,0,0.18)]">
                    <span>
                      I/We agree and acknowledge that the following risks involved in investing / trading in securities listed on the Colombo Stock Exchange ('Risk Disclosure Statements') were explained to me/us by{' '}
                    </span>
                    <input
                      type="text"
                      value={form?.declaration?.schedule2?.explainedByName || ""}
                      data-path="declaration.schedule2.explainedByName"
                      onChange={(e) => update("declaration.schedule2.explainedByName", e.target.value)}
                      placeholder="Enter employee name"
                      className="mx-1 inline-block min-w-[220px] border-0 border-b-2 border-dotted border-zinc-400 bg-transparent px-2 py-0.5 align-baseline text-xs font-medium text-zinc-100 outline-none transition placeholder:text-zinc-500 hover:border-sky-400 focus:border-emerald-400"
                    />
                    <span>
                      , an employee of Asha Securities Ltd ('Stockbroker Firm') and I/we was/were invited to read the below mentioned Risk Disclosure Statements, ask questions and take independent advice if I/we wish to.
                    </span>
                  </div>

                  <div className="mt-3 text-xs text-zinc-400 leading-relaxed">
                    Additionally, I/we acknowledge that I/we understood the following Risk Disclosure Statements;
                  </div>

                  <ol className="mt-3 list-decimal pl-6 text-xs text-zinc-400 space-y-1">
                    <li>
                      The prices of securities fluctuate, sometimes drastically and the price of a security may
                      depreciate in value and may even become valueless.
                    </li>
                    <li>
                      It is possible that losses may be incurred rather than profits made as a result of transacting in securities.
                    </li>
                    <li>
                      It is advisable to invest funds that are not required in the short term to reduce the risk of investing.
                    </li>
                  </ol>

                  {/* Signatures row + Date (matches doc layout) */}
                  <div className="mt-6 grid grid-cols-1 gap-4">
                    <FileUpload
                      label="Signature of Principal Applicant"
                      accept="image/*,.pdf"
                      file={principalSig}
                      setFile={setPrincipalSig}
                      path="principalSig"
                    />

                    <FileUpload
                      label="Signature of Joint Applicant"
                      accept="image/*,.pdf"
                      file={jointSig}
                      setFile={setJointSig}
                        path="jointSig"
                    />

                    <FileUpload
                      label="Signature of 2nd Joint Applicant"
                      accept="image/*,.pdf"
                      file={secondJointSig}
                      setFile={setSecondJointSig}
                        path="secondJointSig"
                    />

                    <Field label="Date">
                      <Input
                        type="date"
                        value={form?.declaration?.schedule2?.date || ""} path="declaration.schedule2.date"
                        onChange={(e) =>
                          update("declaration.schedule2.date", clampDateYear4(e.target.value))
                        }
                      />
                    </Field>
                  </div>
                </>
              )}

              {/* ===================== PLACEHOLDER STEPS ===================== */}

              {/* ===================== FOREIGN -> INDIVIDUAL ===================== */}
              {isForeignIndividual(region, type) && currentKey === "fiClientRegistration" && (
                <ForeignIndividualUnifiedForm
                  form={form}
                  update={update}
                  busy={busy}
                  principalSig={principalSig}
                  setPrincipalSig={setPrincipalSig}
                  jointSig={jointSig}
                  setJointSig={setJointSig}
                  secondJointSig={secondJointSig}
                  setSecondJointSig={setSecondJointSig}
                  clientSig={clientSig}
                  setClientSig={setClientSig}
                  advisorSig={advisorSig}
                  setAdvisorSig={setAdvisorSig}
                  liAgentSignature={liAgentSignature}
                  setLiAgentSignature={setLiAgentSignature}
                  agreementWitness1Sig={agreementWitness1Sig}
                  setAgreementWitness1Sig={setAgreementWitness1Sig}
                  agreementWitness2Sig={agreementWitness2Sig}
                  setAgreementWitness2Sig={setAgreementWitness2Sig}
                  cfPrincipalSig={cfPrincipalSig}
                  setCfPrincipalSig={setCfPrincipalSig}
                  cfFirmSig={cfFirmSig}
                  setCfFirmSig={setCfFirmSig}
                  cfWitness1Sig={cfWitness1Sig}
                  setCfWitness1Sig={setCfWitness1Sig}
                  cfWitness2Sig={cfWitness2Sig}
                  setCfWitness2Sig={setCfWitness2Sig}
                />
              )}
              
              {isForeignCorporate(region, type) && currentKey === "fcClientRegistration" && (
                <ForeignCorporateNewForm
                  form={form}
                  update={update}
                  busy={busy}

                  fcBankStatement={fcBankStatement}
                  setFcBankStatement={setFcBankStatement}
                  fcBoardResolution={fcBoardResolution}
                  setFcBoardResolution={setFcBoardResolution}
                  fcMemorandumArticles={fcMemorandumArticles}
                  setFcMemorandumArticles={setFcMemorandumArticles}
                  fcIncorporationCertificate={fcIncorporationCertificate}
                  setFcIncorporationCertificate={setFcIncorporationCertificate}
                  fcDirector1Sig={fcDir1Sig}
                  setFcDirector1Sig={setFcDir1Sig}
                  fcDirector2Sig={fcDir2Sig}
                  setFcDirector2Sig={setFcDir2Sig}
                  fcCompanySeal={fcCompanySeal}
                  setFcCompanySeal={setFcCompanySeal}
                  clientSig={clientSig}
                  setClientSig={setClientSig}
                  advisorSig={advisorSig}
                  setAdvisorSig={setAdvisorSig}
                  fcAgentSignature={fcFinalDir1Sig}
                  setFcAgentSignature={setFcFinalDir1Sig}
                  fcAuthorizerSignature={fcFinalDir2Sig}
                  setFcAuthorizerSignature={setFcFinalDir2Sig}
                  fcStockbrokerFirmSignature={fcFinalCompanySeal}
                  setFcStockbrokerFirmSignature={setFcFinalCompanySeal}
                  fcWitness1Signature={fcCertOfficerSig}
                  setFcWitness1Signature={setFcCertOfficerSig}
                  fcWitness2Signature={fcKycAuthorizedSignatorySig}
                  setFcWitness2Signature={setFcKycAuthorizedSignatorySig}
                  fcPrincipalApplicantSignature={fcKycCertifyingOfficerSig}
                  setFcPrincipalApplicantSignature={setFcKycCertifyingOfficerSig}
                  fcJointApplicantSignature={fcKycInvestmentAdvisorSig}
                  setFcJointApplicantSignature={setFcKycInvestmentAdvisorSig}
                  cfPrincipalSig={cfPrincipalSig}
                  setCfPrincipalSig={setCfPrincipalSig}
                  cfFirmSig={cfFirmSig}
                  setCfFirmSig={setCfFirmSig}
                  cfWitness1Sig={cfWitness1Sig}
                  setCfWitness1Sig={setCfWitness1Sig}
                  cfWitness2Sig={cfWitness2Sig}
                  setCfWitness2Sig={setCfWitness2Sig}
                />
              )}

              {isForeignCorporate(region, type) && currentKey === "fcKyc" && (
                <ForeignCorporateKYCForm
                  form={form}
                  update={update}
                  busy={busy}
                  kycDocs={kycDocs}
                  setKycDocs={setKycDocs}
                  authorizedSignatorySig={fcKycAuthorizedSignatorySig}
                  setAuthorizedSignatorySig={setFcKycAuthorizedSignatorySig}
                  certifyingOfficerSig={fcKycCertifyingOfficerSig}
                  setCertifyingOfficerSig={setFcKycCertifyingOfficerSig}
                  investmentAdvisorSig={fcKycInvestmentAdvisorSig}
                  setInvestmentAdvisorSig={setFcKycInvestmentAdvisorSig}
                />
              )}

              {isForeignCorporate(region, type) && currentKey === "fcBeneficialOwnership" && (
                <ForeignCorporateBeneficialOwnershipForm
                  form={form}
                  update={update}
                  busy={busy}
                  boDocs={boDocs}
                  setBoDocs={setBoDocs}
                  authorizedPersonSig={fcBoAuthorizedPersonSig}
                  setAuthorizedPersonSig={setFcBoAuthorizedPersonSig}
                  afiSignatureSeal={fcBoAfiSignatureSeal}
                  setAfiSignatureSeal={setFcBoAfiSignatureSeal}
                />
              )}

              {isForeignCorporate(region, type) && currentKey === "fcAdditionalRequirements" && (
                <ForeignCorporateAdditionalRequirements
                  form={form}
                  update={update}
                  busy={busy}
                  additionalDocs={additionalDocs}
                  setAdditionalDocs={setAdditionalDocs}
                />
              )}

{/* ===================== LOCAL CORPORATE (NEW single form) ===================== */}
              {isLocalCorporate(region, type) && currentKey === "clientRegistration" && (
                <LocalCorporateNewForm
                  form={form}
                  update={update}
                  busy={busy}
                  lcBankStatement={lcBankStatement}
                  setLcBankStatement={setLcBankStatement}
                  lcBoardResolution={lcBoardResolution}
                  setLcBoardResolution={setLcBoardResolution}
                  lcMemorandumArticles={lcMemorandumArticles}
                  setLcMemorandumArticles={setLcMemorandumArticles}
                  lcIncorporationCertificate={lcIncorporationCertificate}
                  setLcIncorporationCertificate={setLcIncorporationCertificate}
                  lcDirector1Sig={lcDirector1Sig}
                  setLcDirector1Sig={setLcDirector1Sig}
                  lcDirector2Sig={lcDirector2Sig}
                  setLcDirector2Sig={setLcDirector2Sig}
                  lcCompanySeal={lcCompanySeal}
                  setLcCompanySeal={setLcCompanySeal}
                  clientSig={clientSig}
                  setClientSig={setClientSig}
                  advisorSig={advisorSig}
                  setAdvisorSig={setAdvisorSig}
                  lcAgentSignature={lcAgentSignature}
                  setLcAgentSignature={setLcAgentSignature}
                  lcAuthorizerSignature={lcAuthorizerSignature}
                  setLcAuthorizerSignature={setLcAuthorizerSignature}
                  lcStockbrokerFirmSignature={lcStockbrokerFirmSignature}
                  setLcStockbrokerFirmSignature={setLcStockbrokerFirmSignature}
                  lcWitness1Signature={lcWitness1Signature}
                  setLcWitness1Signature={setLcWitness1Signature}
                  lcWitness2Signature={lcWitness2Signature}
                  setLcWitness2Signature={setLcWitness2Signature}
                  lcPrincipalApplicantSignature={lcPrincipalApplicantSignature}
                  setLcPrincipalApplicantSignature={setLcPrincipalApplicantSignature}
                  lcJointApplicantSignature={lcJointApplicantSignature}
                  setLcJointApplicantSignature={setLcJointApplicantSignature}
                  cfPrincipalSig={cfPrincipalSig}
                  setCfPrincipalSig={setCfPrincipalSig}
                  cfFirmSig={cfFirmSig}
                  setCfFirmSig={setCfFirmSig}
                  cfWitness1Sig={cfWitness1Sig}
                  setCfWitness1Sig={setCfWitness1Sig}
                  cfWitness2Sig={cfWitness2Sig}
                  setCfWitness2Sig={setCfWitness2Sig}
                />
              )}

              {/* ===================== CLIENT AGREEMENT (DOC STYLE) ===================== */}
              {currentKey === "clientAgreement" && (
                <ClientAgreement
                  form={form}
                  update={update}
                  busy={busy}
                  onPrev={back}
                  onNext={next}
                  jointEnabled={jointEnabled}
                  secondJointEnabled={secondJointEnabled}

                  // Applicant signatures (already in Wizard)
                  principalSig={principalSig}
                  setPrincipalSig={setPrincipalSig}
                  jointSig={jointSig}
                  setJointSig={setJointSig}
                  secondJointSig={secondJointSig}
                  setSecondJointSig={setSecondJointSig}

                  // Broker + witnesses (NEW)
                  agreementFirmSig={agreementFirmSig}
                  setAgreementFirmSig={setAgreementFirmSig}
                  agreementWitness1Sig={agreementWitness1Sig}
                  setAgreementWitness1Sig={setAgreementWitness1Sig}
                  agreementWitness2Sig={agreementWitness2Sig}
                  setAgreementWitness2Sig={setAgreementWitness2Sig}
                />
              )}



              {/* ===================== AGREEMENT - CREDIT FACILITY (DOC STYLE) ===================== */}
              {currentKey === "creditFacility" && (
                isLocalCorporate(region, type) ? (
                  <CreditFacilityAgreementLocalCorporate
                    form={form}
                    update={update}
                    busy={busy}
                    onPrev={back}
                    onNext={next}
                    cfPrincipalSig={cfPrincipalSig}
                    setCfPrincipalSig={setCfPrincipalSig}
                    cfFirmSig={cfFirmSig}
                    setCfFirmSig={setCfFirmSig}
                    cfWitness1Sig={cfWitness1Sig}
                    setCfWitness1Sig={setCfWitness1Sig}
                    cfWitness2Sig={cfWitness2Sig}
                    setCfWitness2Sig={setCfWitness2Sig}
                  />
                ) : (
                  <CreditFacilityAgreementLocalIndividual
                    form={form}
                    update={update}
                    busy={busy}
                    onPrev={back}
                    onNext={next}
                    cfPrincipalSig={cfPrincipalSig}
                    setCfPrincipalSig={setCfPrincipalSig}
                    cfFirmSig={cfFirmSig}
                    setCfFirmSig={setCfFirmSig}
                    cfWitness1Sig={cfWitness1Sig}
                    setCfWitness1Sig={setCfWitness1Sig}
                    cfWitness2Sig={cfWitness2Sig}
                    setCfWitness2Sig={setCfWitness2Sig}
                  />

                )
              )}

              {/* ===================== PAYMENT INSTRUCTION ===================== */}
              {currentKey === "paymentInstruction" && (
                isLocalCorporate(region, type) ? (
                  <PaymentInstructionLocalCorporate
                    form={form}
                    update={update}
                    busy={busy}
                    onPrev={back}
                    onNext={next}

                    piPrincipalSig={lcPiPrincipalSig}
                    setPiPrincipalSig={setLcPiPrincipalSig}
                    piJointSig={lcPiJointSig}
                    setPiJointSig={setLcPiJointSig}
                    piWitnessSig={lcPiWitnessSig}
                    setPiWitnessSig={setLcPiWitnessSig}
                  />
                ) : (
                  <PaymentInstructionLocalIndividual
                    form={form}
                    update={update}
                    busy={busy}
                    onPrev={back}
                    onNext={next}

                    // IMPORTANT: use the SAME signature state from Client Registration
                    piPrincipalSig={principalSig}
                    setPiPrincipalSig={setPrincipalSig}

                    // These 2 are required props in PaymentInstructionLocalIndividual
                    // Add states in Step 3
                    piJointSig={piJointSig}
                    setPiJointSig={setPiJointSig}
                    piWitnessSig={piWitnessSig}
                    setPiWitnessSig={setPiWitnessSig}
                  />
                )
              )}

              {/* ===================== Direction Online Form And Agreement ===================== */}
              {currentKey === "directionOnline" && (
                <DirectionOnlineForm
                  form={form}
                  update={update}
                  busy={busy}
                  onPrev={back}
                  onNext={doSubmit}   // or next, depending on your flow

                  doPrincipalSig={principalSig}
                  setDoPrincipalSig={setPrincipalSig}

                  doJointSig={jointSig}
                  setDoJointSig={setJointSig}
                />

              )}

              {/* {["paymentInstruction", "directionOnline"].includes( */}
              {/* {["directionOnline"].includes(
                currentKey
              ) && (
                <>
                  <h2 className="text-xl font-semibold">{steps[step - 1].title}</h2>
                  <p className="mt-2 text-sm text-zinc-400">
                    (Placeholder) Upload the screenshots/pages for this section and I will build every
                    checkbox/field exactly like the form.
                  </p>

                  <label className="mt-5 flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/30 p-4">
                    <input
                      type="checkbox"
                      checked={form[currentKey].accepted}
                      onChange={(e) => update(`${currentKey}.accepted`, e.target.checked)}
                    />
                    <span className="text-sm text-zinc-200">I accept</span>
                  </label>

                  <div className="mt-4">
                    <Field label="Notes (optional)">
                      <Input path={`${currentKey}.notes`}
                        value={form[currentKey].notes}
                        onChange={(e) => update(`${currentKey}.notes`, e.target.value)}
                        placeholder="Any notes..."
                      />
                    </Field>
                  </div>
                </>
              )} */}
              </FormErrorProvider>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-zinc-200 bg-white/70 p-3 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/60">
              <div className="flex items-center gap-3">
                <button
                  onClick={back}
                  disabled={step === 1 || busy}
                  className="rounded-2xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                >
                  Back
                </button>

                <button
                  onClick={() => {
                    clearDraft(region, type);
                    setForm(clone(empty));
                    setStep(1);
                    setError("");
                    // Reset uploads too (prevents stale required-upload validations)
                    resetUploads();
                    setCorpRegCert(null);
                    setKycDocs(null);
                    setBoDocs(null);
                    setAdditionalDocs(null);
                  }}
                  disabled={busy}
                  className="text-sm text-zinc-600 underline underline-offset-4 hover:text-zinc-900 disabled:opacity-40 dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  Clear saved draft for this form
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-xs text-zinc-600 whitespace-nowrap dark:text-zinc-400">Saved automatically</div>
                {step < total ? (
                  <button
                    onClick={next}
                    disabled={busy}
                    className="rounded-2xl bg-white text-black px-4 py-2 text-sm font-semibold"
                  >
                    Next
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={openPreview}
                      disabled={busy}
                      className="rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                    >
                      Preview
                    </button>
                    <button
                      onClick={doSubmit}
                      disabled={busy}
                      className="rounded-2xl bg-white text-black px-4 py-2 text-sm font-semibold"
                    >
                      {busy ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
        </div>
      </div>
      {previewOpen ? (
        <div className="fixed inset-0 z-[80] bg-zinc-950/70 p-3 sm:p-6 backdrop-blur-sm">
          <div className="mx-auto flex h-full w-full max-w-7xl flex-col overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center justify-between gap-4 border-b border-zinc-200 px-4 py-4 dark:border-zinc-800 sm:px-6">
              <div>
                <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Preview</div>
                {/* <div className="text-sm text-zinc-600 dark:text-zinc-400">Review the exact filled form and uploaded documents before final submission.</div> */}
              </div>
              <div className="flex items-center gap-2">
                {/* <button
                  type="button"
                  onClick={() => window.print()}
                  className="rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                >
                  Print
                </button> */}
                <button
                  type="button"
                  onClick={() => setPreviewOpen(false)}
                  className="rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                >
                  Close
                </button>
              </div>
            </div>

            <div ref={previewScrollRef} className="min-h-0 flex-1 overflow-y-auto bg-zinc-50 px-3 py-3 dark:bg-zinc-950/60 sm:px-6 sm:py-6">
              <div className="mx-auto max-w-5xl rounded-3xl border border-zinc-200 bg-white p-3 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/70 sm:p-5">
                <div className="mb-4 space-y-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
                  <div>
                    This preview is read-only. If anything needs to be changed, close the preview, update the form, and preview again.
                  </div>
                  {/* <div className="rounded-2xl border border-emerald-300/70 bg-white/70 px-3 py-2 text-xs font-medium text-emerald-900 dark:border-emerald-800/60 dark:bg-zinc-950/40 dark:text-emerald-100">
                    The emailed PDF will now be generated as a fuller document-style copy so the recipient can see the form structure, paragraphs, and agreement sections more clearly.
                  </div> */}
                </div>

                {error || previewErrorEntries.length ? (
                  <div className="mb-4 overflow-hidden rounded-3xl border border-red-200 bg-gradient-to-r from-red-50 via-rose-50 to-orange-50 shadow-sm dark:border-red-900/40 dark:from-red-950/40 dark:via-rose-950/30 dark:to-orange-950/20">
                    <div className="border-b border-red-200/70 px-4 py-3 dark:border-red-900/40 sm:px-5">
                      <div className="text-sm font-semibold text-red-900 dark:text-red-100">
                        Submission needs a quick fix before it can continue.
                      </div>
                      {/* <div className="mt-1 text-sm text-red-700 dark:text-red-200/90">
                        You can now see the submit error inside the preview as well. Fix the highlighted field{previewErrorEntries.length === 1 ? "" : "s"} after closing this preview, then try again.
                      </div> */}
                    </div>

                    {error ? (
                      <div className="px-4 pt-3 text-sm font-medium text-red-800 dark:text-red-100 sm:px-5">
                        {error}
                      </div>
                    ) : null}

                    {previewErrorEntries.length ? (
                      <div className="px-4 pb-4 pt-3 sm:px-5">
                        {/* <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-red-700/80 dark:text-red-200/80">
                          Validation details
                        </div> */}
                        <div className="grid gap-2 sm:grid-cols-2">
                          {previewErrorEntries.slice(0, 8).map(({ path, message }, index) => (
                            <button
                              key={`${path}-${index}`}
                              type="button"
                              onClick={() => jumpToField(path)}
                              className="rounded-2xl border border-red-200/80 bg-white/80 px-3 py-2 text-left text-sm text-red-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-white dark:border-red-900/40 dark:bg-zinc-950/50 dark:text-red-100"
                            >
                              <div className="font-medium">{message}</div>
                            </button>
                          ))}
                        </div>
                        {previewErrorEntries.length > 8 ? (
                          <div className="mt-2 text-xs text-red-700/80 dark:text-red-200/70">
                            + {previewErrorEntries.length - 8} more field error{previewErrorEntries.length - 8 === 1 ? "" : "s"}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <div className="pointer-events-none select-text [&_input]:cursor-default [&_label]:cursor-default" dangerouslySetInnerHTML={{ __html: previewMarkup }} />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 px-4 py-4 dark:border-zinc-800 sm:px-6">
              {/* <div className="text-sm text-zinc-600 dark:text-zinc-400">Looks good? You can submit directly from here.</div> */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewOpen(false)}
                  className="rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                >
                  Back to Edit
                </button>
                <button
                  type="button"
                  onClick={doSubmit}
                  disabled={busy}
                  className="inline-flex min-w-[180px] items-center justify-center rounded-2xl border border-red-300 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:from-red-700 hover:via-rose-700 hover:to-red-800 hover:shadow-xl hover:shadow-red-500/30 focus:outline-none focus:ring-2 focus:ring-red-400/60 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500/30 dark:from-red-500 dark:via-rose-500 dark:to-red-600 dark:shadow-red-900/30 dark:hover:from-red-400 dark:hover:via-rose-400 dark:hover:to-red-500 dark:focus:ring-offset-zinc-950"
                >
                  {busy ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SectionTitle({ children, className = "" }) {
  return (
    <div className={`mt-5 text-xs font-semibold text-zinc-700 dark:text-zinc-200 ${className}`}>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-zinc-200 my-6 dark:bg-zinc-800" />;
}

function Grid2({ children }) {
  return <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}

function ColSpan2({ children }) {
  return <div className="md:col-span-2">{children}</div>;
}

function CheckRow({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white/70 px-4 py-3 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/30">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="text-zinc-900 dark:text-zinc-200">{label}</span>
    </label>
  );
}