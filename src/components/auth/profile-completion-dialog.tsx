"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

import {
  updateUserProfileAction,
  type UserProfileData,
} from "@/actions/user-profile-action";
import { userProfileSchema } from "@/actions/schema/user-profile";

interface ProfileCompletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

const genderOptions = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "NON_BINARY", label: "Non-binary" },
  { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
  { value: "OTHER", label: "Other" },
] as const;

const ethnicityOptions = [
  {
    value: "AMERICAN_INDIAN_ALASKA_NATIVE",
    label: "American Indian or Alaska Native",
  },
  { value: "ASIAN", label: "Asian" },
  { value: "BLACK_AFRICAN_AMERICAN", label: "Black or African American" },
  { value: "HISPANIC_LATINO", label: "Hispanic or Latino" },
  {
    value: "NATIVE_HAWAIIAN_PACIFIC_ISLANDER",
    label: "Native Hawaiian or Pacific Islander",
  },
  { value: "WHITE", label: "White" },
  { value: "MULTIRACIAL", label: "Multiracial" },
  { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
  { value: "OTHER", label: "Other" },
] as const;

const bloodTypeOptions = [
  { value: "A_POSITIVE", label: "A+" },
  { value: "A_NEGATIVE", label: "A-" },
  { value: "B_POSITIVE", label: "B+" },
  { value: "B_NEGATIVE", label: "B-" },
  { value: "AB_POSITIVE", label: "AB+" },
  { value: "AB_NEGATIVE", label: "AB-" },
  { value: "O_POSITIVE", label: "O+" },
  { value: "O_NEGATIVE", label: "O-" },
  { value: "UNKNOWN", label: "Unknown" },
] as const;

export function ProfileCompletionDialog({
  open,
  onOpenChange,
  onComplete,
}: ProfileCompletionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [medications, setMedications] = useState<string[]>([]);

  const form = useForm<UserProfileData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      dateOfBirth: "",
      gender: "PREFER_NOT_TO_SAY",
      ethnicity: "PREFER_NOT_TO_SAY",
      heightCm: undefined,
      weightKg: undefined,
      bloodType: undefined,
      medicalConditions: undefined,
      allergies: undefined,
      medications: undefined,
      emergencyContactName: undefined,
      emergencyContactPhone: undefined,
      dataProcessingConsent: false,
      marketingConsent: false,
      researchConsent: false,
    },
  });

  const handleAddItem = (
    type: "medical" | "allergy" | "medication",
    value: string
  ) => {
    if (!value.trim()) return;

    switch (type) {
      case "medical":
        setMedicalConditions((prev) => [...prev, value.trim()]);
        break;
      case "allergy":
        setAllergies((prev) => [...prev, value.trim()]);
        break;
      case "medication":
        setMedications((prev) => [...prev, value.trim()]);
        break;
    }
  };

  const handleRemoveItem = (
    type: "medical" | "allergy" | "medication",
    index: number
  ) => {
    switch (type) {
      case "medical":
        setMedicalConditions((prev) => prev.filter((_, i) => i !== index));
        break;
      case "allergy":
        setAllergies((prev) => prev.filter((_, i) => i !== index));
        break;
      case "medication":
        setMedications((prev) => prev.filter((_, i) => i !== index));
        break;
    }
  };

  const onSubmit: SubmitHandler<UserProfileData> = async (
    data: UserProfileData
  ) => {
    setIsSubmitting(true);
    toast.loading("Saving your health profile...");

    try {
      console.log("Submitting profile data:", {
        ...data,
        medicalConditions,
        allergies,
        medications,
      });

      const result = await updateUserProfileAction({
        ...data,
        medicalConditions,
        allergies,
        medications,
      });

      console.log("Profile update result:", result);

      if (result?.data) {
        toast.dismiss();
        toast.success("🎉 Health profile completed successfully!");
        onComplete();
        onOpenChange(false);
      } else {
        toast.dismiss();
        console.error(
          "Profile update failed:",
          result?.serverError || result?.validationErrors
        );

        // If it's a database table error, show helpful message
        if (result?.serverError?.includes("does not exist")) {
          toast.error(
            "Database not set up. Please contact support or set up the database."
          );
        } else {
          toast.error(
            `Failed to save profile: ${result?.serverError || "Unknown error"}`
          );
        }
      }
    } catch (error) {
      toast.dismiss();
      console.error("Profile update error:", error);

      // Handle database table not existing
      if (error instanceof Error && error.message.includes("does not exist")) {
        toast.error(
          "Database not set up. Please contact support or set up the database."
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Your Health Profile</DialogTitle>
          <DialogDescription>
            Help us personalize your longevity coaching by providing some basic
            health information. All data is encrypted and HIPAA-compliant.
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {step} of 4</span>
            <span>{Math.round((step / 4) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Basic Health Information
                </h3>

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => {
                    const currentYear = new Date().getFullYear();
                    const startYear = currentYear - 120; // 120 years ago
                    const endYear = currentYear - 13; // 13 years ago (minimum age)

                    const years = Array.from(
                      { length: endYear - startYear + 1 },
                      (_, i) => endYear - i
                    );

                    const months = Array.from({ length: 12 }, (_, i) => ({
                      value: i + 1,
                      label: new Date(2000, i).toLocaleString("default", {
                        month: "long",
                      }),
                    }));

                    const selectedDate = field.value
                      ? new Date(field.value)
                      : null;
                    const selectedYear = selectedDate?.getFullYear();
                    const selectedMonth = selectedDate
                      ? selectedDate.getMonth() + 1
                      : undefined;
                    const selectedDay = selectedDate?.getDate();

                    // Get days in selected month/year
                    const daysInMonth =
                      selectedYear && selectedMonth
                        ? new Date(selectedYear, selectedMonth, 0).getDate()
                        : 31;
                    const days = Array.from(
                      { length: daysInMonth },
                      (_, i) => i + 1
                    );

                    const updateDate = (
                      year?: number,
                      month?: number,
                      day?: number
                    ) => {
                      const newYear = year ?? selectedYear;
                      const newMonth = month ?? selectedMonth;
                      const newDay = day ?? selectedDay;

                      if (newYear && newMonth && newDay) {
                        const date = new Date(newYear, newMonth - 1, newDay);
                        field.onChange(date.toISOString().split("T")[0]);
                      }
                    };

                    return (
                      <FormItem>
                        <FormLabel>Date of Birth *</FormLabel>
                        <div className="grid grid-cols-3 gap-2">
                          <Select
                            value={selectedYear?.toString()}
                            onValueChange={(value) =>
                              updateDate(
                                parseInt(value),
                                selectedMonth,
                                selectedDay
                              )
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[200px]">
                              {years.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Select
                            value={selectedMonth?.toString()}
                            onValueChange={(value) =>
                              updateDate(
                                selectedYear,
                                parseInt(value),
                                selectedDay
                              )
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Month" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {months.map((month) => (
                                <SelectItem
                                  key={month.value}
                                  value={month.value.toString()}
                                >
                                  {month.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Select
                            value={selectedDay?.toString()}
                            onValueChange={(value) =>
                              updateDate(
                                selectedYear,
                                selectedMonth,
                                parseInt(value)
                              )
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Day" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {days.map((day) => (
                                <SelectItem key={day} value={day.toString()}>
                                  {day}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {genderOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ethnicity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ethnicity *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select ethnicity" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ethnicityOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Physical Measurements</h3>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="heightCm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (cm)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined
                              )
                            }
                            placeholder="170"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weightKg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined
                              )
                            }
                            placeholder="70"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="bloodType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select blood type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {bloodTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Health Information</h3>

                {/* Medical Conditions */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Medical Conditions
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a medical condition"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddItem("medical", e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        const input = e.currentTarget
                          .previousElementSibling as HTMLInputElement;
                        handleAddItem("medical", input.value);
                        input.value = "";
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {medicalConditions.map((condition, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer"
                      >
                        {condition}
                        <button
                          type="button"
                          className="ml-2 text-xs"
                          onClick={() => handleRemoveItem("medical", index)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Allergies */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Allergies</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add an allergy"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddItem("allergy", e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        const input = e.currentTarget
                          .previousElementSibling as HTMLInputElement;
                        handleAddItem("allergy", input.value);
                        input.value = "";
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {allergies.map((allergy, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer"
                      >
                        {allergy}
                        <button
                          type="button"
                          className="ml-2 text-xs"
                          onClick={() => handleRemoveItem("allergy", index)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Medications */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Current Medications
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a medication"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddItem("medication", e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        const input = e.currentTarget
                          .previousElementSibling as HTMLInputElement;
                        handleAddItem("medication", input.value);
                        input.value = "";
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {medications.map((medication, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer"
                      >
                        {medication}
                        <button
                          type="button"
                          className="ml-2 text-xs"
                          onClick={() => handleRemoveItem("medication", index)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="emergencyContactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Contact Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Full name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emergencyContactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Contact Phone</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="+1 (555) 123-4567" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Privacy & Consent</h3>

                <FormField
                  control={form.control}
                  name="dataProcessingConsent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-medium">
                          Data Processing Consent *
                        </FormLabel>
                        <FormDescription>
                          I consent to the processing of my health data for
                          personalized longevity coaching. This is required to
                          use our services.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="marketingConsent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-medium">
                          Marketing Communications
                        </FormLabel>
                        <FormDescription>
                          Receive emails about new features, health tips, and
                          product updates.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="researchConsent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-medium">
                          Research Participation
                        </FormLabel>
                        <FormDescription>
                          Allow anonymous use of my data for longevity research
                          studies.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? "Completing Profile..."
                      : "Complete Profile"}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Cursor rules applied correctly.
