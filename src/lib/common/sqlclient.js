var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var dist = { exports: {} };
(function(module, exports) {
  !function(e, t) {
    module.exports = t();
  }(commonjsGlobal, function() {
    return (() => {
      var e = { 870: (e2, t2, n2) => {
        n2.r(t2), n2.d(t2, { createEndpoint: () => o, expose: () => l, proxy: () => v, proxyMarker: () => r, releaseProxy: () => a, transfer: () => y, transferHandlers: () => c, windowEndpoint: () => g, wrap: () => f });
        const r = Symbol("Comlink.proxy"), o = Symbol("Comlink.endpoint"), a = Symbol("Comlink.releaseProxy"), i = Symbol("Comlink.thrown"), s = (e3) => "object" == typeof e3 && null !== e3 || "function" == typeof e3, c = /* @__PURE__ */ new Map([["proxy", { canHandle: (e3) => s(e3) && e3[r], serialize(e3) {
          const { port1: t3, port2: n3 } = new MessageChannel();
          return l(e3, t3), [n3, [n3]];
        }, deserialize: (e3) => (e3.start(), f(e3)) }], ["throw", { canHandle: (e3) => s(e3) && i in e3, serialize({ value: e3 }) {
          let t3;
          return t3 = e3 instanceof Error ? { isError: true, value: { message: e3.message, name: e3.name, stack: e3.stack } } : { isError: false, value: e3 }, [t3, []];
        }, deserialize(e3) {
          if (e3.isError)
            throw Object.assign(new Error(e3.value.message), e3.value);
          throw e3.value;
        } }]]);
        function l(e3, t3 = self) {
          t3.addEventListener("message", function n3(r2) {
            if (!r2 || !r2.data)
              return;
            const { id: o2, type: a2, path: s2 } = Object.assign({ path: [] }, r2.data), c2 = (r2.data.argumentList || []).map(w);
            let f2;
            try {
              const t4 = s2.slice(0, -1).reduce((e4, t5) => e4[t5], e3), n4 = s2.reduce((e4, t5) => e4[t5], e3);
              switch (a2) {
                case 0:
                  f2 = n4;
                  break;
                case 1:
                  t4[s2.slice(-1)[0]] = w(r2.data.value), f2 = true;
                  break;
                case 2:
                  f2 = n4.apply(t4, c2);
                  break;
                case 3:
                  f2 = v(new n4(...c2));
                  break;
                case 4:
                  {
                    const { port1: t5, port2: n5 } = new MessageChannel();
                    l(e3, n5), f2 = y(t5, [t5]);
                  }
                  break;
                case 5:
                  f2 = void 0;
              }
            } catch (e4) {
              f2 = { value: e4, [i]: 0 };
            }
            Promise.resolve(f2).catch((e4) => ({ value: e4, [i]: 0 })).then((e4) => {
              const [r3, i2] = b(e4);
              t3.postMessage(Object.assign(Object.assign({}, r3), { id: o2 }), i2), 5 === a2 && (t3.removeEventListener("message", n3), u(t3));
            });
          }), t3.start && t3.start();
        }
        function u(e3) {
          (function(e4) {
            return "MessagePort" === e4.constructor.name;
          })(e3) && e3.close();
        }
        function f(e3, t3) {
          return d(e3, [], t3);
        }
        function p(e3) {
          if (e3)
            throw new Error("Proxy has been released and is not useable");
        }
        function d(e3, t3 = [], n3 = function() {
        }) {
          let r2 = false;
          const i2 = new Proxy(n3, { get(n4, o2) {
            if (p(r2), o2 === a)
              return () => E(e3, { type: 5, path: t3.map((e4) => e4.toString()) }).then(() => {
                u(e3), r2 = true;
              });
            if ("then" === o2) {
              if (0 === t3.length)
                return { then: () => i2 };
              const n5 = E(e3, { type: 0, path: t3.map((e4) => e4.toString()) }).then(w);
              return n5.then.bind(n5);
            }
            return d(e3, [...t3, o2]);
          }, set(n4, o2, a2) {
            p(r2);
            const [i3, s2] = b(a2);
            return E(e3, { type: 1, path: [...t3, o2].map((e4) => e4.toString()), value: i3 }, s2).then(w);
          }, apply(n4, a2, i3) {
            p(r2);
            const s2 = t3[t3.length - 1];
            if (s2 === o)
              return E(e3, { type: 4 }).then(w);
            if ("bind" === s2)
              return d(e3, t3.slice(0, -1));
            const [c2, l2] = m(i3);
            return E(e3, { type: 2, path: t3.map((e4) => e4.toString()), argumentList: c2 }, l2).then(w);
          }, construct(n4, o2) {
            p(r2);
            const [a2, i3] = m(o2);
            return E(e3, { type: 3, path: t3.map((e4) => e4.toString()), argumentList: a2 }, i3).then(w);
          } });
          return i2;
        }
        function m(e3) {
          const t3 = e3.map(b);
          return [t3.map((e4) => e4[0]), (n3 = t3.map((e4) => e4[1]), Array.prototype.concat.apply([], n3))];
          var n3;
        }
        const h = /* @__PURE__ */ new WeakMap();
        function y(e3, t3) {
          return h.set(e3, t3), e3;
        }
        function v(e3) {
          return Object.assign(e3, { [r]: true });
        }
        function g(e3, t3 = self, n3 = "*") {
          return { postMessage: (t4, r2) => e3.postMessage(t4, n3, r2), addEventListener: t3.addEventListener.bind(t3), removeEventListener: t3.removeEventListener.bind(t3) };
        }
        function b(e3) {
          for (const [t3, n3] of c)
            if (n3.canHandle(e3)) {
              const [r2, o2] = n3.serialize(e3);
              return [{ type: 3, name: t3, value: r2 }, o2];
            }
          return [{ type: 0, value: e3 }, h.get(e3) || []];
        }
        function w(e3) {
          switch (e3.type) {
            case 3:
              return c.get(e3.name).deserialize(e3.value);
            case 0:
              return e3.value;
          }
        }
        function E(e3, t3, n3) {
          return new Promise((r2) => {
            const o2 = new Array(4).fill(0).map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)).join("-");
            e3.addEventListener("message", function t4(n4) {
              n4.data && n4.data.id && n4.data.id === o2 && (e3.removeEventListener("message", t4), r2(n4.data));
            }), e3.start && e3.start(), e3.postMessage(Object.assign({ id: o2 }, t3), n3);
          });
        }
      }, 162: function(e2, t2, n2) {
        var r = this && this.__createBinding || (Object.create ? function(e3, t3, n3, r2) {
          void 0 === r2 && (r2 = n3), Object.defineProperty(e3, r2, { enumerable: true, get: function() {
            return t3[n3];
          } });
        } : function(e3, t3, n3, r2) {
          void 0 === r2 && (r2 = n3), e3[r2] = t3[n3];
        }), o = this && this.__setModuleDefault || (Object.create ? function(e3, t3) {
          Object.defineProperty(e3, "default", { enumerable: true, value: t3 });
        } : function(e3, t3) {
          e3.default = t3;
        }), a = this && this.__importStar || function(e3) {
          if (e3 && e3.__esModule)
            return e3;
          var t3 = {};
          if (null != e3)
            for (var n3 in e3)
              "default" !== n3 && Object.prototype.hasOwnProperty.call(e3, n3) && r(t3, e3, n3);
          return o(t3, e3), t3;
        };
        Object.defineProperty(t2, "__esModule", { value: true }), t2.createDbWorker = void 0;
        const i = a(n2(870));
        async function s(e3) {
          if (e3.data && "eval" === e3.data.action) {
            const t3 = new Int32Array(e3.data.notify, 0, 2), n3 = new Uint8Array(e3.data.notify, 8);
            let r2;
            try {
              r2 = { ok: await u(e3.data.request) };
            } catch (t4) {
              console.error("worker request error", e3.data.request, t4), r2 = { err: String(t4) };
            }
            const o2 = new TextEncoder().encode(JSON.stringify(r2));
            n3.set(o2, 0), t3[1] = o2.length, Atomics.notify(t3, 0);
          }
        }
        function c(e3) {
          if ("BODY" === e3.tagName)
            return "body";
          const t3 = [];
          for (; e3.parentElement && "BODY" !== e3.tagName; ) {
            if (e3.id) {
              t3.unshift("#" + e3.id);
              break;
            }
            {
              let n3 = 1, r2 = e3;
              for (; r2.previousElementSibling; )
                r2 = r2.previousElementSibling, n3++;
              t3.unshift(e3.tagName.toLowerCase() + ":nth-child(" + n3 + ")");
            }
            e3 = e3.parentElement;
          }
          return t3.join(" > ");
        }
        function l(e3) {
          return Object.keys(e3);
        }
        async function u(e3) {
          if (console.log("dom vtable request", e3), "select" === e3.type)
            return [...document.querySelectorAll(e3.selector)].map((t3) => {
              const n3 = {};
              for (const r2 of e3.columns)
                "selector" === r2 ? n3.selector = c(t3) : "parent" === r2 ? t3.parentElement && (n3.parent = t3.parentElement ? c(t3.parentElement) : null) : "idx" === r2 || (n3[r2] = t3[r2]);
              return n3;
            });
          if ("insert" === e3.type) {
            if (!e3.value.parent)
              throw Error('"parent" column must be set when inserting');
            const t3 = document.querySelectorAll(e3.value.parent);
            if (0 === t3.length)
              throw Error(`Parent element ${e3.value.parent} could not be found`);
            if (t3.length > 1)
              throw Error(`Parent element ${e3.value.parent} ambiguous (${t3.length} results)`);
            const n3 = t3[0];
            if (!e3.value.tagName)
              throw Error("tagName must be set for inserting");
            const r2 = document.createElement(e3.value.tagName);
            for (const t4 of l(e3.value))
              if (null !== e3.value[t4]) {
                if ("tagName" === t4 || "parent" === t4)
                  continue;
                if ("idx" === t4 || "selector" === t4)
                  throw Error(`${t4} can't be set`);
                r2[t4] = e3.value[t4];
              }
            return n3.appendChild(r2), null;
          }
          if ("update" === e3.type) {
            const t3 = document.querySelector(e3.value.selector);
            if (!t3)
              throw Error(`Element ${e3.value.selector} not found!`);
            const n3 = [];
            for (const r2 of l(e3.value)) {
              const o2 = e3.value[r2];
              if ("parent" !== r2) {
                if ("idx" !== r2 && "selector" !== r2 && o2 !== t3[r2]) {
                  if (console.log("SETTING ", r2, t3[r2], "->", o2), "tagName" === r2)
                    throw Error("can't change tagName");
                  n3.push(r2);
                }
              } else if (o2 !== c(t3.parentElement)) {
                const e4 = document.querySelectorAll(o2);
                if (1 !== e4.length)
                  throw Error(`Invalid target parent: found ${e4.length} matches`);
                e4[0].appendChild(t3);
              }
            }
            for (const r2 of n3)
              t3[r2] = e3.value[r2];
            return null;
          }
          throw Error(`unknown request ${e3.type}`);
        }
        i.transferHandlers.set("WORKERSQLPROXIES", { canHandle: (e3) => false, serialize(e3) {
          throw Error("no");
        }, deserialize: (e3) => (e3.start(), i.wrap(e3)) }), t2.createDbWorker = async function(e3, t3, n3, r2 = 1 / 0) {
          const o2 = new Worker(t3), a2 = i.wrap(o2), c2 = await a2.SplitFileHttpDatabase(n3, e3, void 0, r2);
          return o2.addEventListener("message", s), { db: c2, worker: a2, configs: e3 };
        };
      }, 432: function(e2, t2, n2) {
        var r = this && this.__createBinding || (Object.create ? function(e3, t3, n3, r2) {
          void 0 === r2 && (r2 = n3), Object.defineProperty(e3, r2, { enumerable: true, get: function() {
            return t3[n3];
          } });
        } : function(e3, t3, n3, r2) {
          void 0 === r2 && (r2 = n3), e3[r2] = t3[n3];
        }), o = this && this.__exportStar || function(e3, t3) {
          for (var n3 in e3)
            "default" === n3 || Object.prototype.hasOwnProperty.call(t3, n3) || r(t3, e3, n3);
        };
        Object.defineProperty(t2, "__esModule", { value: true }), o(n2(162), t2);
      } }, t = {};
      function n(r) {
        var o = t[r];
        if (void 0 !== o)
          return o.exports;
        var a = t[r] = { exports: {} };
        return e[r].call(a.exports, a, a.exports, n), a.exports;
      }
      return n.d = (e2, t2) => {
        for (var r in t2)
          n.o(t2, r) && !n.o(e2, r) && Object.defineProperty(e2, r, { enumerable: true, get: t2[r] });
      }, n.o = (e2, t2) => Object.prototype.hasOwnProperty.call(e2, t2), n.r = (e2) => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e2, "__esModule", { value: true });
      }, n(432);
    })();
  });
})(dist);
let worker;
let setDbReady;
let isDbReady = new Promise((r) => setDbReady = r);

async function initDbConfig({baseUrl = "/assets/" , workerWasmUrl = "/assets/" , fileName = "config.json"}) {
  worker = await dist.exports.createDbWorker([
    {
      from: "jsonconfig",
      configUrl: baseUrl + fileName
    }
  ], workerWasmUrl + "sqlite.worker.js", workerWasmUrl + "sql-wasm.wasm");
  setDbReady(true);
}
async function query(q) {
  if (!worker) {
    console.warn("Waiting for db initialization before querying");
    await isDbReady;
  }
  return await worker.db.query(q);
}
export { initDbConfig, isDbReady, query };
