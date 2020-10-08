import { ErrorHandler } from "@angular/core";
import { ErrorService } from "./error.service";

export const errorProvider = { provide: ErrorHandler, useClass: ErrorService };
