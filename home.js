const citations = {
  uvmarvel: `@inproceedings{ye2026uvmarvel,
  title={UVMarvel: an Automated LLM-aided UVM Machine for Subsystem-level RTL Verification},
  author={Ye, Junhao and Pan, Dingrong and Liu, Hanyuan and Hu, Yuchen and Zhou, Jie and Xu, Ke and Fang, Xinwei and Wang, Xi and Guan, Nan and Jiang, Zhe},
  booktitle={Proceedings of the 63rd ACM/IEEE Design Automation Conference (DAC)},
  year={2026},
  url={https://arxiv.org/abs/2605.04704}
}`,
  smartcraft: `@inproceedings{zhou2026smartcraft,
  title={Work Smarter, Not Harder: An LLM-Enabled Agentic Framework for Automated RTL Generation and Debugging},
  author={Zhou, Jie and Ji, Youshu and Zhang, Shiyue and Ye, Junhao and Wang, Ning and Han, Wenjun and Fang, Xinwei and Guan, Nan and Wang, Xi and Jiang, Zhe},
  booktitle={2026 IEEE/ACM International Conference on Computer-Aided Design (ICCAD)},
  year={2026},
  url={https://github.com/SEU-ACAL/SmartCraft}
}`,
  uvm2: `@inproceedings{ye2025concept,
  title={From Concept to Practice: an Automated LLM-aided UVM Machine for RTL Verification},
  author={Ye, Junhao and Hu, Yuchen and Xu, Ke and Pan, Dingrong and Chen, Qichun and Zhou, Jie and Zhao, Shuai and Fang, Xinwei and Wang, Xi and Guan, Nan and Jiang, Zhe},
  booktitle={2025 IEEE/ACM International Conference on Computer-Aided Design (ICCAD)},
  year={2025},
  pages={1--9},
  doi={10.1109/ICCAD66269.2025.11240679}
}`,
  uvllm: `@inproceedings{hu2025uvllm,
  title={UVLLM: An Automated Universal RTL Verification Framework using LLMs},
  author={Hu, Yuchen and Ye, Junhao and Xu, Ke and Sun, Jialin and Zhang, Shiyue and Jiao, Xinyao and Pan, Dingrong and Zhou, Jie and Wang, Ning and Shan, Weiwei and Fang, Xinwei and Wang, Xi and Guan, Nan and Jiang, Zhe},
  booktitle={2025 62nd ACM/IEEE Design Automation Conference (DAC)},
  year={2025},
  pages={1--7},
  doi={10.1109/DAC63849.2025.11435108}
}`,
};

const copyText = async (text) => {
  if (!text) throw new Error("Citation unavailable");
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall through to the textarea fallback when browser permissions block clipboard access.
    }
  }
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.focus();
  field.select();
  const copied = document.execCommand("copy");
  field.remove();
  if (!copied) throw new Error("Clipboard unavailable");
};

document.querySelectorAll("[data-news-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    const list = button.closest(".news-panel").querySelector(".news-list");
    const expanded = list.classList.toggle("news-expanded");
    button.setAttribute("aria-expanded", String(expanded));
    button.textContent = expanded ? "Show less ↑" : "Show more · 10 earlier updates ↓";
  });
});

document.querySelectorAll("[data-cite]").forEach((button) => {
  button.addEventListener("click", async () => {
    const label = button.textContent;
    try {
      await copyText(citations[button.dataset.cite]);
      button.textContent = "Copied!";
    } catch {
      button.textContent = "Copy failed";
    }
    window.setTimeout(() => { button.textContent = label; }, 1600);
  });
});

const quickLinks = [...document.querySelectorAll(".quick-nav-link")];
const quickSections = quickLinks
  .map((link) => document.getElementById(link.getAttribute("href").slice(1)))
  .filter(Boolean);
const sectionVisibility = new Map();

const setActiveQuickLink = (activeId) => {
  quickLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === "#" + activeId;
    link.classList.toggle("is-active", isActive);
    if (isActive) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
};

if ("IntersectionObserver" in window && quickSections.length) {
  const quickObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => sectionVisibility.set(entry.target.id, entry));
    const visibleSections = [...sectionVisibility.values()]
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    if (visibleSections.length) setActiveQuickLink(visibleSections[0].target.id);
  }, {
    rootMargin: "-18% 0px -62% 0px",
    threshold: [0, 0.15, 0.35, 0.6, 1],
  });

  quickSections.forEach((section) => quickObserver.observe(section));
}