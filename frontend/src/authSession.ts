const API = "http://localhost:5001/api";

function getAuth() {
  const u = localStorage.getItem("aura_user");
  return {
    user: u ? JSON.parse(u) : null,
    accessToken: localStorage.getItem("aura_access_token"),
    refreshToken: localStorage.getItem("aura_refresh_token"),
  };
}

function setAuth(user: any, accessToken: string, refreshToken: string) {
  localStorage.setItem("aura_user", JSON.stringify(user));
  localStorage.setItem("aura_access_token", accessToken);
  localStorage.setItem("aura_refresh_token", refreshToken);
}

function clearAuth() {
  localStorage.removeItem("aura_user");
  localStorage.removeItem("aura_access_token");
  localStorage.removeItem("aura_refresh_token");
}

const origFetch = window.fetch.bind(window);
window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
  if (!url.startsWith(API)) return origFetch(input, init);

  const auth = getAuth();
  const headers = new Headers(init?.headers || {});
  if (auth.accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${auth.accessToken}`);
  }

  let res = await origFetch(input, { ...init, headers });
  if (res.status === 401 && auth.refreshToken && !url.includes("/auth/refresh")) {
    const r = await origFetch(`${API}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: auth.refreshToken }),
    });
    if (r.ok) {
      const d = await r.json();
      setAuth(auth.user, d.accessToken, d.refreshToken);
      headers.set("Authorization", `Bearer ${d.accessToken}`);
      res = await origFetch(input, { ...init, headers });
    } else {
      clearAuth();
      renderAuthGate();
    }
  }
  return res;
};

export function renderAuthGate() {
  document.getElementById("aura-auth-overlay")?.remove();
  document.getElementById("aura-session-pill")?.remove();
  const auth = getAuth();

  if (!auth.user || !auth.accessToken) {
    const box = document.createElement("div");
    box.id = "aura-auth-overlay";
    box.style.cssText = "position:fixed;inset:0;z-index:999999;background:rgba(10,10,12,0.94);backdrop-filter:blur(14px);display:flex;align-items:center;justify-content:center;padding:20px;font-family:inherit;color:#fff;";
    box.innerHTML = `
      <div style="width:100%;max-width:400px;background:#121316;border:1px solid rgba(234,179,8,0.28);border-radius:14px;padding:32px;box-shadow:0 25px 60px rgba(0,0,0,0.85);">
        <div style="font-size:10px;letter-spacing:3px;color:#eab308;text-transform:uppercase;margin-bottom:8px;">AURA MOTORS ATELIER</div>
        <h2 id="gTitle" style="font-size:22px;font-weight:700;letter-spacing:0.5px;margin:0 0 20px;">Create Account</h2>

        <div style="display:flex;gap:8px;margin-bottom:18px;">
          <button id="tReg" type="button" style="flex:1;padding:9px;border-radius:8px;border:none;background:#eab308;color:#000;font-weight:700;font-size:12px;letter-spacing:0.5px;cursor:pointer;">Register</button>
          <button id="tLog" type="button" style="flex:1;padding:9px;border-radius:8px;border:1px solid #27272a;background:#18181b;color:#a1a1aa;font-weight:600;font-size:12px;letter-spacing:0.5px;cursor:pointer;">Sign In</button>
        </div>

        <div id="gMsg" style="display:none;padding:10px 12px;border-radius:8px;font-size:12px;margin-bottom:14px;"></div>

        <form id="fReg" style="display:flex;flex-direction:column;gap:12px;">
          <input id="rN" required placeholder="Full Name" style="padding:12px 14px;background:#09090b;border:1px solid #27272a;border-radius:8px;color:#fff;font-size:13px;outline:none;">
          <input id="rE" type="email" required placeholder="Email Address" style="padding:12px 14px;background:#09090b;border:1px solid #27272a;border-radius:8px;color:#fff;font-size:13px;outline:none;">
          <input id="rP" type="password" required minlength="6" placeholder="Password" style="padding:12px 14px;background:#09090b;border:1px solid #27272a;border-radius:8px;color:#fff;font-size:13px;outline:none;">
          <button type="submit" style="margin-top:4px;padding:12px;background:#eab308;color:#000;border:none;border-radius:8px;font-weight:700;font-size:13px;letter-spacing:0.5px;cursor:pointer;">Register</button>
        </form>

        <form id="fLog" style="display:none;flex-direction:column;gap:12px;">
          <input id="lE" type="email" required placeholder="Email Address" style="padding:12px 14px;background:#09090b;border:1px solid #27272a;border-radius:8px;color:#fff;font-size:13px;outline:none;">
          <input id="lP" type="password" required placeholder="Password" style="padding:12px 14px;background:#09090b;border:1px solid #27272a;border-radius:8px;color:#fff;font-size:13px;outline:none;">
          <button type="submit" style="margin-top:4px;padding:12px;background:#eab308;color:#000;border:none;border-radius:8px;font-weight:700;font-size:13px;letter-spacing:0.5px;cursor:pointer;">Sign In</button>
        </form>
      </div>
    `;
    document.body.appendChild(box);

    const msg = document.getElementById("gMsg")!;
    const show = (t: string, ok: boolean) => {
      msg.style.display = "block";
      msg.style.background = ok ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)";
      msg.style.border = ok ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(239,68,68,0.3)";
      msg.style.color = ok ? "#6ee7b7" : "#fca5a5";
      msg.textContent = t;
    };

    const fR = document.getElementById("fReg")!;
    const fL = document.getElementById("fLog")!;
    const tR = document.getElementById("tReg")!;
    const tL = document.getElementById("tLog")!;

    tR.onclick = () => {
      fR.style.display = "flex"; fL.style.display = "none";
      tR.style.background = "#eab308"; tR.style.color = "#000"; tR.style.border = "none";
      tL.style.background = "#18181b"; tL.style.color = "#a1a1aa"; tL.style.border = "1px solid #27272a";
      document.getElementById("gTitle")!.textContent = "Create Account";
      msg.style.display = "none";
    };

    tL.onclick = () => {
      fL.style.display = "flex"; fR.style.display = "none";
      tL.style.background = "#eab308"; tL.style.color = "#000"; tL.style.border = "none";
      tR.style.background = "#18181b"; tR.style.color = "#a1a1aa"; tR.style.border = "1px solid #27272a";
      document.getElementById("gTitle")!.textContent = "Sign In";
      msg.style.display = "none";
    };

    fR.onsubmit = async (e) => {
      e.preventDefault();
      const email = (document.getElementById("rE") as HTMLInputElement).value;
      const password = (document.getElementById("rP") as HTMLInputElement).value;
      const r = await origFetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: (document.getElementById("rN") as HTMLInputElement).value,
          email,
          password,
        }),
      });
      const d = await r.json();
      if (!r.ok) return show(d.error || "Registration failed.", false);
      tL.click();
      show("Account created. Please sign in.", true);
      (document.getElementById("lE") as HTMLInputElement).value = email;
      (document.getElementById("lP") as HTMLInputElement).value = password;
    };

    fLog.onsubmit = async (e) => {
      e.preventDefault();
      const r = await origFetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: (document.getElementById("lE") as HTMLInputElement).value,
          password: (document.getElementById("lP") as HTMLInputElement).value,
        }),
      });
      const d = await r.json();
      if (!r.ok) return show(d.error || "Invalid credentials.", false);
      setAuth(d.user, d.accessToken, d.refreshToken);
      renderAuthGate();
    };
    return;
  }

  const pill = document.createElement("div");
  pill.id = "aura-session-pill";
  pill.style.cssText = "position:fixed;bottom:18px;right:18px;z-index:999998;background:#121316;border:1px solid rgba(234,179,8,0.3);color:#fff;padding:9px 14px;border-radius:10px;font-family:inherit;font-size:12px;display:flex;align-items:center;gap:12px;box-shadow:0 10px 30px rgba(0,0,0,0.6);";
  pill.innerHTML = `
    <span style="color:#e4e4e7;">${auth.user.name} <span style="margin-left:6px;background:rgba(234,179,8,0.15);color:#eab308;border:1px solid rgba(234,179,8,0.3);padding:2px 6px;border-radius:4px;font-size:10px;font-weight:700;text-transform:uppercase;">${auth.user.role}</span></span>
    <button id="bOut" style="padding:5px 10px;background:#18181b;color:#e4e4e7;border:1px solid #27272a;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;">Sign Out</button>
  `;
  document.body.appendChild(pill);

  document.getElementById("bOut")!.onclick = async () => {
    const s = getAuth();
    await origFetch(`${API}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: s.refreshToken }),
    });
    clearAuth();
    renderAuthGate();
  };
}

renderAuthGate();
