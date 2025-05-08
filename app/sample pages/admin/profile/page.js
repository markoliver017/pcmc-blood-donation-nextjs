import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import Password from "./Password";
import UpdateProfile from "./UpdateProfile";
import { getAdmin } from "./action";
import { auth } from "@lib/auth";
export const metadata = {
    title: "Inmerse Portal - Profile",
    description:
        "Integrated National Medication Error Reporting System - Profile",
};

export default async function Page() {
    const session = await auth();

    if (!session) return;

    const { user } = session;
    const admin = await getAdmin(user?.email);

    // console.log("session>>>>>>>", session)

    return (
        <div className="flex justify-center">
            <Tabs defaultValue="profile" className="w-full md:w-3/4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="password">Change Password</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                    <UpdateProfile admin={admin} />
                </TabsContent>
                <TabsContent value="password">
                    <Password admin={admin} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
