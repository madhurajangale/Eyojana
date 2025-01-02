import json
import random

# Define scheme categories and related attributes
scheme_names = {
    "Agriculture": [f"Agriculture, Rural & Environment {i+1}" for i in range(20)],
    "Banking": [f"Banking, Financial Services and Insurance {i+1}" for i in range(20)],
    "Business Entrepreneurship": [f"Business & Entrepreneurship {i+1}" for i in range(20)],
    "Education": [f"Education & Learning {i+1}" for i in range(20)],
    "Health": [f"Health & Wellness {i+1}" for i in range(20)],
    "Housing": [f"Housing & Shelter {i+1}" for i in range(20)],
    "Public Safety": [f"Public Safety, Law & Justice {i+1}" for i in range(20)],
    "Science": [f"Science, IT & Communications {i+1}" for i in range(20)],
    "Skills": [f"Skills & Employment {i+1}" for i in range(20)],
    "Social Welfare": [f"Social Welfare & Empowerment {i+1}" for i in range(20)],
    "Sports": [f"Sports & Culture {i+1}" for i in range(20)],
    "Transport": [f"Transport & Infrastructure {i+1}" for i in range(20)],
    "Travel": [f"Travel & Tourism {i+1}" for i in range(20)],
    "Utility and Sanitation": [f"Utility & Sanitation {i+1}" for i in range(20)],
    "Women and Child": [f"Women and Child {i+1}" for i in range(20)],
}

# Ministries for each category
ministries_by_category = {
    "Agriculture": "Ministry of Agriculture",
    "Banking": "Ministry of Finance",
    "Business Entrepreneurship": "Ministry of Finance",
    "Education": "Ministry of Education",
    "Health": "Ministry of Health",
    "Housing": "Ministry of Housing",
    "Public Safety": "Ministry of Home Affairs",
    "Science": "Ministry of Science",
    "Skills": "Ministry of Skill Development",
    "Social Welfare": "Ministry of Social Justice and Empowerment",
    "Sports": "Ministry of Sports",
    "Transport": "Ministry of Transport",
    "Travel": "Ministry of Tourism",
    "Utility and Sanitation": "Ministry of Urban Development",
    "Women and Child": "Ministry of Women and Child Development"
}
# Add details and benefits for each scheme category with more depth
scheme_details_and_benefits = {
    "Agriculture": {
        "details": "The Agriculture scheme is designed to foster sustainable growth in the agricultural sector by promoting modern farming techniques, enhancing irrigation systems, and providing financial support to farmers. It aims to empower rural communities by making agriculture more profitable and environmentally sustainable. By improving land management and offering subsidies for equipment, the scheme works to transform the rural economy and ensure food security.",
        "benefits": "Farmers will benefit from access to affordable loans, crop insurance, and technical support in adopting innovative farming practices. Additionally, the scheme supports training programs to teach new farming techniques, helping farmers improve productivity. They will also gain improved market access, increased yield, and better income stability. This will ultimately lead to rural economic development, enhanced food production, and improved livelihoods."
    },
    "Banking": {
        "details": "The Banking, Financial Services, and Insurance (BFSI) scheme aims to provide comprehensive financial services to underserved and marginalized populations across the country. It includes initiatives to open bank accounts, promote digital banking, and increase financial literacy among the masses. By enabling easier access to credit and insurance, the scheme ensures that all citizens, especially in rural and remote areas, can benefit from formal financial services.",
        "benefits": "Beneficiaries will gain the ability to access essential financial products such as savings accounts, loans, insurance policies, and investment opportunities. The scheme aims to reduce financial exclusion, boost savings habits, and promote financial resilience. Additionally, individuals will receive financial education to improve their understanding of managing money and growing wealth. This will lead to greater economic empowerment, improved livelihoods, and enhanced financial security."
    },
    "Business Entrepreneurship": {
        "details": "The Business & Entrepreneurship scheme is designed to support aspiring entrepreneurs and small businesses through a combination of financial aid, mentoring, and resource access. It aims to cultivate a startup ecosystem by offering seed funding, business incubation, and mentoring programs. This initiative provides the necessary tools to help individuals turn their business ideas into successful ventures.",
        "benefits": "Entrepreneurs will gain access to low-interest loans, seed funding, and grants to help launch and grow their businesses. The scheme also provides access to a network of experienced mentors and business leaders who offer guidance and advice on business development. With government support for market entry, young entrepreneurs can overcome initial barriers to success. This leads to job creation, innovation, and increased entrepreneurial activity within local economies."
    },
    "Education": {
        "details": "The Education & Learning scheme strives to make quality education more accessible to students from underprivileged backgrounds. By providing scholarships, free textbooks, and vocational training, the scheme ensures that every child has an equal opportunity to succeed academically. This initiative is designed to reduce dropout rates, improve school infrastructure, and encourage lifelong learning.",
        "benefits": "Students will receive financial aid to cover tuition fees, study materials, and living expenses. The scheme also includes career counseling services, helping students identify future career opportunities and pathways. By ensuring that educational resources reach even the most marginalized populations, the scheme helps create a well-educated workforce. This will result in better employment opportunities, reduced poverty, and increased national productivity."
    },
    "Health": {
        "details": "The Health & Wellness scheme focuses on improving public health outcomes through accessible healthcare services and preventative care initiatives. It offers a wide range of services, including free or subsidized medical treatments, health insurance coverage, and vaccination programs. This initiative also aims to address key health issues such as malnutrition, maternal mortality, and the spread of communicable diseases.",
        "benefits": "Beneficiaries will have access to essential healthcare services, including free medical consultations, vaccinations, and treatment for chronic diseases. The scheme promotes overall wellness by funding community health programs that educate citizens on maintaining healthy lifestyles. Additionally, it provides financial protection through health insurance policies, ensuring that even low-income individuals can afford necessary treatments. This leads to better public health, a reduction in preventable diseases, and a healthier population overall."
    },
    "Housing": {
        "details": "The Housing & Shelter scheme aims to provide affordable housing solutions for low-income and rural families. It includes both direct housing grants and subsidies for the construction of new homes as well as support for repairs and renovations. The scheme seeks to address housing shortages, improve living conditions, and create sustainable housing solutions in urban and rural areas.",
        "benefits": "Families will benefit from low-interest loans and government subsidies to either build or purchase homes. The scheme ensures that beneficiaries live in safe, hygienic, and well-maintained housing, contributing to a higher standard of living. It also supports energy-efficient housing solutions, helping reduce utility costs. By facilitating homeownership, the scheme leads to improved community stability and wealth accumulation, while reducing homelessness and overcrowding."
    },
    "Public Safety": {
        "details": "The Public Safety, Law & Justice scheme is designed to enhance the safety and security of communities across the country. It includes initiatives to strengthen law enforcement agencies, improve disaster response capabilities, and enhance public safety infrastructure. The scheme aims to create safer communities where citizens feel secure and protected from crime and natural disasters.",
        "benefits": "The public will experience enhanced safety through increased police presence, improved emergency response times, and better-equipped law enforcement agencies. The scheme also ensures the availability of disaster relief services and community engagement programs aimed at reducing crime. By improving law enforcement, the scheme fosters trust in public institutions and leads to safer living environments. This ultimately promotes peace, security, and economic development."
    },
    "Science": {
        "details": "The Science, IT & Communications scheme is dedicated to advancing scientific research, innovation, and technology in India. It aims to foster collaboration between universities, research institutions, and private companies to drive technological breakthroughs. Through funding and support for innovation hubs, the scheme seeks to place India at the forefront of global scientific and technological advancements.",
        "benefits": "Researchers, innovators, and institutions will gain access to funding, research grants, and technical resources to fuel their work. The scheme also promotes collaborations between the public and private sectors, fostering knowledge exchange and technological innovation. Through this initiative, India will strengthen its position in global technology and research arenas, fostering economic growth through innovation and creating job opportunities in high-tech industries."
    },
    "Skills": {
        "details": "The Skills & Employment scheme focuses on equipping youth with the necessary skills to secure employment in growing industries. It provides free vocational training, job placement services, and internships to help individuals transition from education to employment. The scheme aims to bridge the skills gap and create a highly skilled workforce that meets the needs of modern industries.",
        "benefits": "Participants will receive hands-on training in fields such as technology, healthcare, manufacturing, and more. Upon completion, they will have the qualifications necessary to enter the workforce with higher earning potential. The scheme also provides job placement services, ensuring that individuals find opportunities that align with their skills. By closing the skills gap, this initiative boosts employment rates, supports economic growth, and reduces poverty."
    },
    "Social Welfare": {
        "details": "The Social Welfare & Empowerment scheme provides targeted support to economically disadvantaged groups, including the elderly, disabled, and marginalized communities. It offers financial assistance, food security programs, and access to healthcare, ensuring that all citizens can live with dignity and access essential services.",
        "benefits": "Beneficiaries will receive regular financial support to meet basic living expenses, including food, housing, and healthcare. The scheme also offers rehabilitation programs for people with disabilities and social support services for the elderly. By addressing the needs of vulnerable populations, the scheme reduces inequality and enhances social cohesion, improving overall quality of life for marginalized communities."
    },
    "Sports": {
        "details": "The Sports & Culture scheme encourages physical activity and sports participation at all levels, from grassroots to professional sports. It focuses on developing sports infrastructure, providing training and resources to athletes, and organizing national and international competitions. The scheme aims to promote health, fitness, and national pride through sports and culture.",
        "benefits": "Athletes and sports enthusiasts will have access to world-class training facilities, coaching, and sports science support. The scheme also provides funding for participation in national and international competitions, helping athletes achieve their potential. By encouraging widespread participation in sports, the initiative promotes health, fosters national pride, and provides opportunities for professional athletes to excel on the global stage."
    },
    "Transport": {
        "details": "The Transport & Infrastructure scheme focuses on developing and maintaining transportation networks that improve accessibility and reduce travel time across the country. It supports both urban and rural transportation systems, from roads and bridges to railways and airports. The scheme aims to create a more efficient transportation ecosystem that connects people, goods, and services.",
        "benefits": "The public will benefit from improved roads, highways, public transportation, and better connectivity between urban and rural areas. The scheme reduces travel time, making commuting faster and safer. Improved infrastructure supports economic activity by enhancing supply chains and creating job opportunities in the transportation and logistics sectors. Ultimately, the scheme promotes economic growth and mobility for all citizens."
    },
    "Travel": {
        "details": "The Travel & Tourism scheme focuses on promoting India as a global tourist destination. By improving infrastructure, offering attractive travel packages, and organizing events, the scheme aims to boost the tourism industry and contribute to the country's economy.",
        "benefits": "Tourists will enjoy better access to famous landmarks, cultural sites, and adventure destinations. The scheme provides affordable travel options, ensuring that more people can experience India's rich culture and heritage. Through this initiative, the tourism industry will grow, creating employment opportunities, preserving cultural heritage, and promoting cross-cultural exchange."
    },
    "Utility and Sanitation": {
        "details": "The Utility & Sanitation scheme focuses on improving water and sanitation infrastructure in urban and rural areas. It aims to ensure universal access to clean water, promote waste management practices, and maintain hygiene across the country. The scheme also works to address the challenges posed by urbanization and climate change on sanitation systems.",
        "benefits": "Households will benefit from improved access to drinking water, better sanitation facilities, and waste management services. This will contribute to better health outcomes, reduce pollution, and promote environmental sustainability. The scheme improves living conditions, particularly in underserved communities, leading to enhanced public health and quality of life."
    },
    "Women and Child": {
        "details": "The Women and Child Development scheme focuses on improving the lives of women and children through education, healthcare, and legal support. It works to ensure that women and children have equal access to resources and opportunities, promoting gender equality and reducing discrimination.",
        "benefits": "Women and children will gain access to education, healthcare services, legal protection, and financial aid. The scheme also supports women's empowerment by promoting financial independence and participation in decision-making. By improving access to education and healthcare, the scheme helps break the cycle of poverty and empowers future generations."
    }
}

# Other fixed attributes
age_ranges = {
    category: [f"{random.randint(18, 30)}-{random.randint(31, 60)}" for _ in range(20)]
    for category in scheme_names
}
genders = ["Male", "Female", "Other"]
states = ["Maharashtra", "Karnataka", "Tamil Nadu", "Kerala", "Uttar Pradesh", "Gujarat"]
marital_status = ["Married", "Unmarried", "Widowed", "Divorced"]
income_ranges_proper_format = [
    "< 2,00,000", "1,00,000 - 3,00,000", "2,00,000 - 5,00,000",
    "3,00,000 - 6,00,000", "5,00,000 - 10,00,000"
]
available_castes = ["General", "OBC", "SC", "ST", "EWS"]

# Documents specific to each category
documents_by_category = {
    "Agriculture": [
        "Aadhar Card", "Land Ownership Certificate", "Income Certificate",
        "Agricultural Credit Card", "Bank Passbook", "Soil Health Card"
    ],
    "Banking": [
        "Aadhar Card", "PAN Card", "Bank Statement", "Income Certificate", "Voter ID"
    ],
    "Business Entrepreneurship": [
        "Aadhar Card", "Business Registration Certificate", "Income Certificate",
        "GST Certificate", "Bank Passbook", "PAN Card"
    ],
    "Education": [
        "Aadhar Card", "Birth Certificate", "School/College ID", "Income Certificate",
        "Caste Certificate", "Admission Receipt"
    ],
    "Health": [
        "Aadhar Card", "Health Insurance Card", "Doctor's Prescription",
        "Birth Certificate", "Medical Certificate", "Income Certificate"
    ],
    "Housing": [
        "Aadhar Card", "Land Ownership Certificate", "Income Certificate",
        "Bank Passbook", "Ration Card", "Electricity Bill"
    ],
    "Public Safety": [
        "Aadhar Card", "Voter ID", "Police Clearance Certificate", "Income Certificate",
        "Birth Certificate", "PAN Card"
    ],
    "Science": [
        "Aadhar Card", "Academic Certificates", "Research Proposal",
        "Caste Certificate", "Income Certificate"
    ],
    "Skills": [
        "Aadhar Card", "Training Completion Certificate", "Bank Passbook",
        "Income Certificate", "Birth Certificate"
    ],
    "Social Welfare": [
        "Aadhar Card", "Income Certificate", "Caste Certificate", "Bank Passbook",
        "Ration Card", "Disability Certificate (if applicable)"
    ],
    "Sports": [
        "Aadhar Card", "Sports Achievement Certificates", "Income Certificate",
        "Birth Certificate", "School ID (if student)", "Bank Passbook"
    ],
    "Transport": [
        "Aadhar Card", "Driving License", "Vehicle Registration Certificate",
        "Income Certificate", "PAN Card", "Insurance Certificate"
    ],
    "Travel": [
        "Aadhar Card", "Passport", "Bank Passbook", "Income Certificate",
        "Travel Itinerary", "Voter ID"
    ],
    "Utility and Sanitation": [
        "Aadhar Card", "Income Certificate", "Electricity Bill", "Water Bill",
        "Ration Card", "Caste Certificate"
    ],
    "Women and Child": [
        "Aadhar Card", "Birth Certificate", "Marriage Certificate (if applicable)",
        "Income Certificate", "Caste Certificate", "Ration Card"
    ],
}

# Generate the dataset with the new structure
data = []
j=0
all_documents = set(doc for docs in documents_by_category.values() for doc in docs)
for category, schemes in scheme_names.items():
    benefits =scheme_details_and_benefits[category]["benefits"]
    details = scheme_details_and_benefits[category]["details"]
    j=j
    for i, scheme in enumerate(schemes):
        gender = genders[i % len(genders)]
        employment_status = random.choice(["Employed", "Unemployed", "Self-Employed", "Student"])
        marital_status_value = random.choice(marital_status)

        if marital_status_value == "Widowed":
            gender = "Female"
        if marital_status_value == "Divorced" and gender == "Male":
            marital_status_value = random.choice(["Unmarried", "Married"])

        # Assign documents specific to category
        random_documents = random.sample(
            list(all_documents - set(documents_by_category[category])),
            k=random.randint(2, 4)
        )

        # Generate benefits and details
        
            
        

        # Create an entry with the required data
        entry = {
            "Scheme Name": scheme,
            "Category": category,
            "Gender": gender,
            "Age Range": age_ranges[category][i % len(age_ranges[category])],
            "State": states[i % len(states)],
            "Marital Status": marital_status_value,
            "Income": random.choice(income_ranges_proper_format),
            "Caste": random.sample(available_castes, k=random.randint(1, len(available_castes))),
            "Ministry": ministries_by_category[category],
            "Employment Status": employment_status,
            "Documents": list(set(documents_by_category[category]).union(random_documents)),
           "Benefits": benefits,
            "Details": details

            
        }
        data.append(entry)

# Save the dataset to JSON
output_file = "C:\\Docs\\Rujuta\\techathon\\Eyojana\\dataset_with_benefits_details.json"
with open(output_file, "w") as json_file:
    json.dump(data, json_file, indent=4)

print(f"Dataset with benefits and details has been saved to {output_file}")
