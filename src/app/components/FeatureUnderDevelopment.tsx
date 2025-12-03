import IconButton from "./buttons/IconButton";
import PrimaryButton from "./buttons/PrimaryButton";
import { BracesIcon, CloseIcon, DoubleQuotesL } from "./icons";
import TextArea from "./forms/TextArea";
import TextInput from "./forms/TextInput";

interface FeatureUnderDevelopmentProps {
    onClose?: () => void;
}

export default function FeatureUnderDevelopment({ onClose }: FeatureUnderDevelopmentProps) {
    return (
        <div className="flex w-[568px] p-4 flex-col items-start gap-[30px] rounded-3xl bg-[#151819] border-[0.5px] border-solid border-[rgba(248,252,255,0.24)]">
            <div className="flex flex-col items-start gap-2.5 self-stretch">
                <div className="flex justify-between items-start self-stretch">
                    <div className="flex p-2.5 items-center gap-2.5 rounded-[10px] bg-[#F8FCFF]/6">
                        <BracesIcon className="w-8 h-8 aspect-square" />
                    </div>
                    <IconButton
                        icon={<CloseIcon />}
                        size="sm"
                        status="neutral"
                        onClick={onClose}
                    />
                </div>
                <div className="flex py-[0] px-[12px] flex-col items-start gap-2.5 self-stretch">
                    <span className="text-[#F8FCFF] font-[Figtree] text-[26px] not-italic font-medium leading-[normal] tracking-[1.04px]">Feature under development</span>
                    <span className="text-[#EDEEEE] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.56px]">I’d love your input.</span>
                    <span className="text-[#EDEEEE] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.56px]">
                        - del</span>
                </div>
            </div>
            <div className="flex py-[0] px-[12px] flex-col items-start gap-4 self-stretch">
                <TextInput
                    label="Username"
                    placeholder="Enter your username"
                    width="full"
                    helperText="Choose a unique username"
                />

                <TextInput
                    label="Username"
                    placeholder="Enter your username"
                    width="full"
                    disabled={true}
                    helperText="Choose a unique username"
                />

                <TextInput
                    label="Email Address"
                    placeholder="your@email.com"
                    leadingIcon={<DoubleQuotesL className="w-4 h-4 text-[#F8FCFF]/70" />}
                    error={true}
                    helperText="Invalid email format"
                    width={300}
                />

                <TextInput
                    label="Search"
                    placeholder="Search for something..."
                    leadingIcon={<DoubleQuotesL className="w-4 h-4 text-[#F8FCFF]/70" />}
                    trailingIcon={<DoubleQuotesL className="w-4 h-4 text-[#F8FCFF]/70" />}
                    width="full"
                />
                <TextArea
                    label="Description"
                    placeholder="Enter a detailed description..."
                    rows={4}
                    width={150}
                    helperText="Minimum 50 characters"
                />

                <TextArea
                    label="Quote"
                    placeholder="Type your favorite quote..."
                    leadingIcon={<DoubleQuotesL className="w-4 h-4 text-[#F8FCFF]/70" />}
                    trailingIcon={<DoubleQuotesL className="w-4 h-4 text-[#F8FCFF]/70" />}
                    rows={3}
                    width="full"
                />

                <TextArea
                    label="Read-only Content"
                    value="This is pre-filled content that cannot be edited."
                    disabled={true}
                    rows={2}
                    width="full"
                />

                <TextArea
                    label="Error State"
                    placeholder="This will show an error..."
                    error={true}
                    rows={3}
                    width="full"
                    helperText="This field is required"
                />
            </div>
            <div className="flex flex-col items-end gap-3 self-stretch">

                <PrimaryButton size="md" variant="brand" label="Send to del" disabled />
            </div>
        </div>
    );
}