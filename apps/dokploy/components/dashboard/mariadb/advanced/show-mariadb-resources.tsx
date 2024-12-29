import { AlertBlock } from "@/components/shared/alert-block";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	TooltipProvider,
	TooltipTrigger,
	TooltipContent,
	Tooltip,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const addResourcesMariadb = z.object({
	memoryReservation: z.number().nullable().optional(),
	cpuLimit: z.number().nullable().optional(),
	memoryLimit: z.number().nullable().optional(),
	cpuReservation: z.number().nullable().optional(),
});
interface Props {
	mariadbId: string;
}

type AddResourcesMariadb = z.infer<typeof addResourcesMariadb>;
export const ShowMariadbResources = ({ mariadbId }: Props) => {
	const { data, refetch } = api.mariadb.one.useQuery(
		{
			mariadbId,
		},
		{ enabled: !!mariadbId },
	);
	const { mutateAsync, isLoading } = api.mariadb.update.useMutation();
	const form = useForm<AddResourcesMariadb>({
		defaultValues: {},
		resolver: zodResolver(addResourcesMariadb),
	});

	useEffect(() => {
		if (data) {
			form.reset({
				cpuLimit: data?.cpuLimit || undefined,
				cpuReservation: data?.cpuReservation || undefined,
				memoryLimit: data?.memoryLimit || undefined,
				memoryReservation: data?.memoryReservation || undefined,
			});
		}
	}, [data, form, form.formState.isSubmitSuccessful, form.reset]);

	const onSubmit = async (formData: AddResourcesMariadb) => {
		await mutateAsync({
			mariadbId,
			cpuLimit: formData.cpuLimit || null,
			cpuReservation: formData.cpuReservation || null,
			memoryLimit: formData.memoryLimit || null,
			memoryReservation: formData.memoryReservation || null,
		})
			.then(async () => {
				toast.success("Resources Updated");
				await refetch();
			})
			.catch(() => {
				toast.error("Error to Update the resources");
			});
	};
	return (
		<Card className="bg-background">
			<CardHeader>
				<CardTitle className="text-xl">Resources</CardTitle>
				<CardDescription>
					If you want to decrease or increase the resources to a specific.
					application or database
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<AlertBlock type="info">
					Please remember to click Redeploy after modify the resources to apply
					the changes.
				</AlertBlock>
				<Form {...form}>
					<form
						id="hook-form"
						onSubmit={form.handleSubmit(onSubmit)}
						className="grid w-full gap-8 "
					>
						<div className="grid w-full md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="memoryReservation"
								render={({ field }) => (
									<FormItem>
										<div className="flex items-center gap-2">
											<FormLabel>Memory Reservation</FormLabel>
											<TooltipProvider>
												<Tooltip delayDuration={0}>
													<TooltipTrigger>
														<InfoIcon className="h-4 w-4 text-muted-foreground" />
													</TooltipTrigger>
													<TooltipContent>
														<p>
															Memory soft limit in bytes. Example: 256MB =
															268435456 bytes
														</p>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										</div>
										<FormControl>
											<Input
												placeholder="268435456 (256MB in bytes)"
												{...field}
												value={field.value?.toString() || ""}
												onChange={(e) => {
													const value = e.target.value;
													if (value === "") {
														field.onChange(null);
													} else {
														const number = Number.parseInt(value, 10);
														if (!Number.isNaN(number)) {
															field.onChange(number);
														}
													}
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="memoryLimit"
								render={({ field }) => {
									return (
										<FormItem>
											<div className="flex items-center gap-2">
												<FormLabel>Memory Limit</FormLabel>
												<TooltipProvider>
													<Tooltip delayDuration={0}>
														<TooltipTrigger>
															<InfoIcon className="h-4 w-4 text-muted-foreground" />
														</TooltipTrigger>
														<TooltipContent>
															<p className="text-muted-foreground">
																Memory hard limit in bytes. Example: 1GB =
																1073741824 bytes
															</p>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											</div>
											<FormControl>
												<Input
													placeholder="1073741824 (1GB in bytes)"
													{...field}
													value={field.value?.toString() || ""}
													onChange={(e) => {
														const value = e.target.value;
														if (value === "") {
															field.onChange(null);
														} else {
															const number = Number.parseInt(value, 10);
															if (!Number.isNaN(number)) {
																field.onChange(number);
															}
														}
													}}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									);
								}}
							/>

							<FormField
								control={form.control}
								name="cpuLimit"
								render={({ field }) => {
									return (
										<FormItem>
											<div className="flex items-center gap-2">
												<FormLabel>CPU Limit</FormLabel>
												<TooltipProvider>
													<Tooltip delayDuration={0}>
														<TooltipTrigger>
															<InfoIcon className="h-4 w-4 text-muted-foreground" />
														</TooltipTrigger>
														<TooltipContent>
															<p className="text-muted-foreground">
																CPU quota in units of 10^-9 CPUs. Example: 2
																CPUs = 2000000000
															</p>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											</div>
											<FormControl>
												<Input
													placeholder="2000000000 (2 CPUs)"
													{...field}
													value={field.value?.toString() || ""}
													onChange={(e) => {
														const value = e.target.value;
														if (value === "") {
															field.onChange(null);
														} else {
															const number = Number.parseInt(value, 10);
															if (!Number.isNaN(number)) {
																field.onChange(number);
															}
														}
													}}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									);
								}}
							/>
							<FormField
								control={form.control}
								name="cpuReservation"
								render={({ field }) => {
									return (
										<FormItem>
											<div className="flex items-center gap-2">
												<FormLabel>CPU Reservation</FormLabel>
												<TooltipProvider>
													<Tooltip delayDuration={0}>
														<TooltipTrigger>
															<InfoIcon className="h-4 w-4 text-muted-foreground" />
														</TooltipTrigger>
														<TooltipContent>
															<p className="text-muted-foreground">
																CPU shares (relative weight). Example: 1 CPU =
																1000000000
															</p>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											</div>
											<FormControl>
												<Input
													placeholder="1000000000 (1 CPU)"
													{...field}
													value={field.value?.toString() || ""}
													onChange={(e) => {
														const value = e.target.value;
														if (value === "") {
															field.onChange(null);
														} else {
															const number = Number.parseInt(value, 10);
															if (!Number.isNaN(number)) {
																field.onChange(number);
															}
														}
													}}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									);
								}}
							/>
						</div>
						<div className="flex w-full justify-end">
							<Button isLoading={isLoading} type="submit">
								Save
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};
