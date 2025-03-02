
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { HospitalCreateInput, HospitalUpdateInput, Hospital } from "@/types/hospital";
import { availableSpecialities, availableCities } from "@/services/hospitalService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  city: z.string().min(1, "City is required"),
  imageUrl: z.string().url("Must be a valid URL"),
  specialities: z.array(z.string()).min(1, "At least one speciality is required"),
  rating: z.coerce.number().min(0, "Minimum rating is 0").max(5, "Maximum rating is 5"),
  description: z.string().optional(),
  images: z.array(z.string().url("Must be a valid URL")).optional(),
  numberOfDoctors: z.coerce.number().min(0, "Cannot be negative").optional(),
  numberOfDepartments: z.coerce.number().min(0, "Cannot be negative").optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface HospitalFormProps {
  onSubmit: (data: HospitalCreateInput | HospitalUpdateInput) => void;
  initialData?: Hospital;
  isEditing?: boolean;
}

const HospitalForm: React.FC<HospitalFormProps> = ({
  onSubmit,
  initialData,
  isEditing = false,
}) => {
  const [open, setOpen] = useState(false);
  const [additionalImages, setAdditionalImages] = useState<string[]>(
    initialData?.images || []
  );
  const [newImageUrl, setNewImageUrl] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      city: initialData?.city || "",
      imageUrl: initialData?.imageUrl || "",
      specialities: initialData?.specialities || [],
      rating: initialData?.rating || 0,
      description: initialData?.description || "",
      numberOfDoctors: initialData?.numberOfDoctors || 0,
      numberOfDepartments: initialData?.numberOfDepartments || 0,
      images: initialData?.images || [],
    },
  });

  const { control, handleSubmit, formState } = form;

  const addImage = () => {
    if (newImageUrl && newImageUrl.trim() !== "") {
      setAdditionalImages((prev) => [...prev, newImageUrl]);
      setNewImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onFormSubmit = (data: FormValues) => {
    const formData = {
      ...data,
      images: additionalImages,
    };
    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hospital Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter hospital name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormDescription>Provide a URL for the hospital's main image</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="specialities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specialities</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between font-normal"
                    >
                      {field.value.length > 0
                        ? `${field.value.length} specialities selected`
                        : "Select specialities"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search specialities..." />
                    <CommandEmpty>No speciality found.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {availableSpecialities.map((speciality) => (
                        <CommandItem
                          key={speciality}
                          value={speciality}
                          onSelect={() => {
                            const newValue = field.value.includes(speciality)
                              ? field.value.filter((s) => s !== speciality)
                              : [...field.value, speciality];
                            field.onChange(newValue);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value.includes(speciality)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {speciality}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              {field.value.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {field.value.map((speciality) => (
                    <Badge key={speciality} variant="secondary">
                      {speciality}
                    </Badge>
                  ))}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating (0-5)</FormLabel>
              <FormControl>
                <Input type="number" min="0" max="5" step="0.1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {(isEditing || initialData) && (
          <>
            <Separator className="my-6" />
            
            <h3 className="text-lg font-medium">Additional Details</h3>
            
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter hospital description"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={control}
                name="numberOfDoctors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Doctors</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="numberOfDepartments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Departments</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormLabel>Additional Images</FormLabel>
              <div className="flex space-x-2">
                <Input
                  placeholder="Image URL"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1"
                />
                <Button type="button" onClick={addImage}>
                  Add
                </Button>
              </div>

              {additionalImages.length > 0 && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {additionalImages.map((img, index) => (
                    <div
                      key={index}
                      className="relative overflow-hidden rounded-md border"
                    >
                      <img
                        src={img}
                        alt={`Hospital ${index + 1}`}
                        className="h-40 w-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute right-2 top-2"
                        onClick={() => removeImage(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            className="px-6"
            disabled={formState.isSubmitting}
          >
            {formState.isSubmitting
              ? "Submitting..."
              : isEditing
              ? "Update Hospital"
              : "Create Hospital"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default HospitalForm;
