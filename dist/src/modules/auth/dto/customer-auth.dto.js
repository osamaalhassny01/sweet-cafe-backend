"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRegisterDto = exports.CustomerLoginDto = void 0;
const class_validator_1 = require("class-validator");
class CustomerLoginDto {
}
exports.CustomerLoginDto = CustomerLoginDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{9}$/, { message: 'رقم الهاتف يجب أن يتكون من 9 أرقام' }),
    __metadata("design:type", String)
], CustomerLoginDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(4, { message: 'كلمة السر يجب أن تكون 4 أحرف أو أرقام على الأقل' }),
    __metadata("design:type", String)
], CustomerLoginDto.prototype, "password", void 0);
class CustomerRegisterDto extends CustomerLoginDto {
}
exports.CustomerRegisterDto = CustomerRegisterDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2, { message: 'يرجى إدخال الاسم' }),
    __metadata("design:type", String)
], CustomerRegisterDto.prototype, "name", void 0);
//# sourceMappingURL=customer-auth.dto.js.map