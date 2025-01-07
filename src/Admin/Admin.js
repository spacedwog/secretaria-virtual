"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const Dashboard_1 = __importDefault(require("./pages/Dashboard"));
const Users_1 = __importDefault(require("./pages/Users"));
const Reports_1 = __importDefault(require("./pages/Reports"));
const Sidebar_1 = __importDefault(require("./components/Sidebar"));
const Admin = () => {
    return (<react_router_dom_1.BrowserRouter>
      <div style={{ display: "flex" }}>
        <Sidebar_1.default />
        <main style={{ flex: 1, padding: "20px" }}>
          <react_router_dom_1.Routes>
            <react_router_dom_1.Route path="/" element={<Dashboard_1.default />}/>
            <react_router_dom_1.Route path="/users" element={<Users_1.default />}/>
            <react_router_dom_1.Route path="/reports" element={<Reports_1.default />}/>
          </react_router_dom_1.Routes>
        </main>
      </div>
    </react_router_dom_1.BrowserRouter>);
};
exports.default = Admin;
