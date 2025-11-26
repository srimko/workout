import * as matchers from "@testing-library/jest-dom/matchers"
import { cleanup } from "@testing-library/react"
import { afterEach, expect } from "vitest"

// Étendre les matchers Vitest avec ceux de jest-dom
expect.extend(matchers)

// Nettoyer après chaque test
afterEach(() => {
  cleanup()
})
