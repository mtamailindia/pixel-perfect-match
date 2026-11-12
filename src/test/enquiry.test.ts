import { describe, expect, it } from "vitest";
import { enquiryTypes, enquiryText, validateEnquiry, type Enquiry } from "@/lib/enquiry";
const valid:Enquiry={name:"Example Person",email:"person@example.com",type:"3D Printing",subject:"Prototype enquiry",message:"I would like to discuss a component."};
describe("Enquiry preparation",()=>{
 it("allows exactly the five requested enquiry types",()=>expect(enquiryTypes).toEqual(["3D Printing","Product Enquiry","Software Products","Collaboration","General Enquiry"]));
 it("requires a full name",()=>expect(validateEnquiry({...valid,name:" "}).name).toBeDefined());
 it("rejects invalid email addresses",()=>expect(validateEnquiry({...valid,email:"not-an-email"}).email).toBeDefined());
 it("requires a recognised enquiry type",()=>expect(validateEnquiry({...valid,type:"Orders"}).type).toBeDefined());
 it("requires a subject",()=>expect(validateEnquiry({...valid,subject:""}).subject).toBeDefined());
 it("requires a message",()=>expect(validateEnquiry({...valid,message:""}).message).toBeDefined());
 it("accepts a complete valid enquiry",()=>expect(validateEnquiry(valid)).toEqual({}));
 it("includes user details in an unsent draft",()=>expect(enquiryText(valid)).toContain("Email: person@example.com\nEnquiry type: 3D Printing"));
});
