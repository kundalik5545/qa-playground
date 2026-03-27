/**
 * Registers all Chart.js components once.
 * Import `Chart` from this file in every chart component so that
 * registration is guaranteed before any chart is instantiated.
 */
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export { Chart };
