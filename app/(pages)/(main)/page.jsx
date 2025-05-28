import Image from "next/image";
import MainSlider from "./Slider";

export default function Page() {
    return (
        <div className="space-y-10">
            <MainSlider />
            <section className="flex">
                <div className="flex flex-col justify-between text-justify p-5 text-slate-600">
                    <h2 className="text-4xl font-semibold">Overview</h2>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Reiciendis voluptas repellendus delectus illum
                        temporibus nihil incidunt nostrum laborum distinctio
                        atque voluptatem repudiandae assumenda accusamus itaque,
                        aperiam consectetur provident inventore modi veniam et
                        labore mollitia illo? Architecto rerum, nisi, minima non
                        velit cum laudantium vero harum libero assumenda commodi
                        nulla inventore!
                    </p>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Iusto atque vel suscipit eum esse blanditiis, sed
                        deserunt beatae. Illo, modi!
                    </p>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Iusto atque vel suscipit eum esse blanditiis, sed
                        deserunt beatae. Illo, modi!
                    </p>
                    <div className="text-end">
                        <button className="btn">Read More ...</button>
                    </div>
                </div>
                <div className="h-96 w-[1800px] relative overflow-hidden">
                    <Image
                        src="/slide1.png"
                        className="h-full w-full"
                        alt="Overview Image"
                        fill
                        style={{ objectFit: "cover" }}
                    />
                </div>
            </section>
        </div>
    );
}
